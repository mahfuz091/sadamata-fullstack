"use server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

export async function updateUserAddressProfileImageFile(id, file) {
  if (!file) throw new Error("No file provided");
  console.log(id, "updateuseraddressid");

  // Ensure the directory exists
  const uploadDir = path.join(process.cwd(), "public/profileImage");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Generate unique file name
  const fileExt = path.extname(file.name); // e.g., ".png"
  const fileName = `${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 6)}${fileExt}`;
  const filePath = path.join(uploadDir, fileName);

  // Save the file
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filePath, buffer);

  // Update Prisma
  const updatedAddress = await prisma.user.update({
    where: { id },
    data: {
      profileImage: `/profileImage/${fileName}`,
      updatedAt: new Date(),
    },
  });

  return updatedAddress;
}

// export async function updateUserInfo(userId, data) {
//   console.log(userId, data, "updateuseraddressid");

//   try {
//     // Update User and MerchantProfile
//     const updatedUser = await prisma.user.update({
//       where: { id: userId },
//       data: {
//         name: data.name,
//         email: data.email,
//         phone: data.phone,
//         merchantProfile: {
//           update: {
//             dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
//             permanentAddress: data.address,
//             zipCode: data.zipCode,
//             country: data.country,
//           },
//         },
//       },
//       include: { merchantProfile: true, addresses: true },
//     });

//     return updatedUser;
//   } catch (err) {
//     console.error(err);
//     throw new Error("Failed to update user info");
//   }
// }

export async function updateUserInfo(userId, data) {
  console.log(userId, data, "updateuseraddressid");

  try {
    // Update User and MerchantProfile
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        merchantProfile: {
          update: {
            // existing fields
            dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
            permanentAddress: data.permanentAddress ?? undefined,
            zipCode: data.zipCode ?? undefined,
            country: data.country ?? undefined,
            // NEW fields requested
            nidOrPassportNo: data.nidOrPassportNo ?? undefined,
            presentAddress: data.presentAddress ?? undefined,
            portfolioUrl: data.portfolioUrl ?? undefined,
            websiteUrl: data.websiteUrl ?? undefined,
            updatedAt: new Date(),
          },
        },
      },
      include: { merchantProfile: true, addresses: true },
    });

    return updatedUser;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to update user info");
  }
}

/**
 * Update merchant bank information.
 * userId: id of the user whose merchantProfile will be updated
 * data: { bankName, bankBranch, accountName, accountNumber, routingNumber, country, zipCode }
 */
export async function updateMerchantBankInfo(userId, data) {
  if (!userId) throw new Error("UserId is required");

  try {
    const updated = await prisma.merchantProfile.update({
      where: { userId }, // merchantProfile.userId is unique
      data: {
        bankName: data.bankName,
        bankBranch: data.bankBranch,
        accountName: data.accountName,
        accountNumber: data.accountNumber,
        routingNumber: data.routingNumber,
      },
    });

    return updated;
  } catch (err) {
    console.error("BANK UPDATE ERROR:", err);
    throw new Error("Failed to update bank info");
  }
}

/**
 * Update a user's password
 * @param {string} userId - id of the user
 * @param {object} payload - { currentPassword, newPassword }
 */
export async function updateUserPassword(userId, payload) {
  const { currentPassword, newPassword } = payload || {};

  if (!userId) throw new Error("Missing user id");
  if (!currentPassword || !newPassword)
    throw new Error("Passwords are required");
  if (typeof newPassword !== "string" || newPassword.length < 8) {
    throw new Error("New password must be at least 8 characters");
  }

  try {
    // fetch user and hashed password
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, password: true },
    });

    if (!user) throw new Error("User not found");

    const matches = await bcrypt.compare(currentPassword, user.password);
    if (!matches) {
      throw new Error("Current password is incorrect");
    }

    // hash new password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);

    // update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashed, updatedAt: new Date() },
    });

    return { success: true };
  } catch (err) {
    console.error("updateUserPassword error:", err);
    // rethrow so the client can show an error message
    throw new Error(err.message || "Failed to update password");
  }
}

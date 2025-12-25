"use server";

import prisma from "@/lib/prisma";
import fs from "fs";
import { revalidatePath } from "next/cache";
import path from "path";

// export async function updateUserProfileImageFile(id, file) {
//   if (!file) throw new Error("No file provided");
//   console.log(id, "updateuseraddressid");

//   // Ensure the directory exists
//   const uploadDir = path.join(process.cwd(), "uploads/profileImage");
//   if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
//   }

//   // Generate unique file name
//   const fileExt = path.extname(file.name); // e.g., ".png"
//   const fileName = `${Date.now()}-${Math.random()
//     .toString(36)
//     .substr(2, 6)}${fileExt}`;
//   const filePath = path.join(uploadDir, fileName);

//   // Save the file
//   const buffer = Buffer.from(await file.arrayBuffer());
//   fs.writeFileSync(filePath, buffer);

//   // Update Prisma
//   const updatedAddress = await prisma.user.update({
//     where: { id },
//     data: {
//       profileImage: `uploads/profileImage/${fileName}`,
//       updatedAt: new Date(),
//     },
//   });

//   return updatedAddress;
// }

export async function updateUserProfileImageFile(id, file) {
  try {
    if (!file) throw new Error("No file provided");

    // Ensure the directory exists
    const uploadDir = path.join(process.cwd(), "public/uploads/profileImage");
    // Note: Usually better to serve from 'public' if using Next.js

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Generate unique file name
    const fileExt = path.extname(file.name);
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 6)}${fileExt}`;
    const filePath = path.join(uploadDir, fileName);

    // Save the file to disk
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    // Update Database
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        profileImage: `uploads/profileImage/${fileName}`,
        updatedAt: new Date(),
      },
    });

    return updatedUser;
  } catch (error) {
    console.error("Error updating user profile image:", error);

    // Optional: If DB update fails, you might want to delete the file you just saved
    // to prevent "orphaned" images taking up disk space.
  }
}
export async function updateUserInfo(userId, data) {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,

        userProfile: {
          upsert: {
            create: {
              firstName: data.firstName,
              lastName: data.lastName,
              dateOfBirth: data.dateOfBirth,
              email: data.email,
              phone: data.phone,
              country: data.country,
              address: data.address,
              zipCode: data.zipCode,
            },
            update: {
              firstName: data.firstName,
              lastName: data.lastName,
              dateOfBirth: data.dateOfBirth,
              email: data.email,
              phone: data.phone,
              country: data.country,
              address: data.address,
              zipCode: data.zipCode,
            },
          },
        },
      },
      include: {
        userProfile: true,
        addresses: true,
      },
    });

    return updatedUser;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to update user info");
  }
}

// UPDATE USER + USERPROFILE
export async function updateUserProfile(userId, data) {
  console.log(data, "data");

  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        email: data.email,
        // phone: data.phone,
        name: `${data.firstName} ${data.lastName}`,
        userProfile: {
          upsert: {
            create: {
              firstName: data.firstName,
              lastName: data.lastName,
              dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
              email: data.email,
              phone: data.phone,
              country: data.country,
              address: data.address,
              zipCode: data.zipCode,
            },
            update: {
              firstName: data.firstName,
              lastName: data.lastName,
              dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
              email: data.email,
              phone: data.phone,
              country: data.country,
              address: data.address,
              zipCode: data.zipCode,
            },
          },
        },
      },
      include: { userProfile: true },
    });
    revalidatePath("/profile");
    return updated;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to update profile");
  }
}

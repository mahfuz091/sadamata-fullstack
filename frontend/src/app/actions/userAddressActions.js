"use server";

import prisma from "@/lib/prisma";
import fs from "fs";
import { revalidatePath } from "next/cache";
import path from "path";
import { uploadToS3, getPrivateUrl } from "@/lib/s3";
import { update } from "@/auth";

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
  if (!file) throw new Error("No file provided");

  const fileExt = path.extname(file.name);
  const key = `profile-images/${id}/${Date.now()}${fileExt}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await uploadToS3({ key, body: buffer, contentType: file.type });

  await prisma.user.update({
    where: { id },
    data: { profileImage: key, updatedAt: new Date() },
  });

  // sync new S3 key into JWT so header picks it up immediately
  await update({ user: { profileImage: key } });

  const signedUrl = await getPrivateUrl(key, 86400);
  revalidatePath("/", "layout");
  return { signedUrl };
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

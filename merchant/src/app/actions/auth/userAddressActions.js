
'use server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';


export async function updateUserAddressProfileImageFile(id, file) {
  if (!file) throw new Error('No file provided');
console.log(id, "updateuseraddressid");

  // Ensure the directory exists
  const uploadDir = path.join(process.cwd(), 'public/profileImage');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Generate unique file name
  const fileExt = path.extname(file.name); // e.g., ".png"
  const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 6)}${fileExt}`;
  const filePath = path.join(uploadDir, fileName);

  // Save the file
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filePath, buffer);

  // Update Prisma
  const updatedAddress = await prisma.userAddress.update({
    where: { id },
    data: {
      profileImage: `/profileImage/${fileName}`,
      updatedAt: new Date(),
    },
  });

  return updatedAddress;
}

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
            dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
            permanentAddress: data.address,
            zipCode: data.zipCode,
            country: data.country,
          },
        },
      },
      include: { merchantProfile: true, addresses: true },
    });

    return updatedUser;
  } catch (err) {
    console.error(err);
    throw new Error('Failed to update user info');
  }
}


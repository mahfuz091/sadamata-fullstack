// src/app/actions/address/address.actions.js
"use server";

import prisma from "@/lib/prisma"; // <-- default export from /src/lib/prisma

// Fail fast if Prisma didn't initialize correctly
if (!prisma || typeof prisma.$transaction !== "function") {
  throw new Error(
    "Prisma not initialized. Ensure /src/lib/prisma exports a default PrismaClient " +
      "and your schema's generator output matches that import path."
  );
}

/* -------------------------- small validation helpers -------------------------- */
const req = (v, name) => {
  if (v == null || (typeof v === "string" && v.trim() === "")) {
    throw new Error(`${name} is required`);
  }
  return typeof v === "string" ? v.trim() : v;
};
const trimOrNull = (v) => (v == null ? null : String(v).trim() || null);

/* ----------------------------------- LIST ----------------------------------- */
export async function listUserAddresses({ userId }) {
  req(userId, "userId");
  const addresses = await prisma.userAddress.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
  });
  return { ok: true, addresses };
}

/* ------------------------------------ GET ----------------------------------- */
export async function getUserAddress({ userId, addressId }) {
  req(userId, "userId");
  req(addressId, "addressId");

  const address = await prisma.userAddress.findFirst({ where: { id: addressId, userId } });
  if (!address) return { ok: false, error: "Address not found" };
  return { ok: true, address };
}

/* ----------------------------------- ADD ------------------------------------ */
export async function addUserAddress({
  userId,
  firstName,
  lastName,
  phone,
  email,
  address,
  isDefault = true,
}) {
  req(userId, "userId");
  req(firstName, "firstName");
  req(lastName, "lastName");
  req(phone, "phone");
  req(address, "address");

  const data = {
    userId,
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    phone: phone.trim(),
    email: trimOrNull(email),
    address: address.trim(),
    isDefault: !!isDefault,
  };

  if (data.isDefault) {
    // unset others, then create this one as default — atomic
    const [, created] = await prisma.$transaction([
      prisma.userAddress.updateMany({ where: { userId }, data: { isDefault: false } }),
      prisma.userAddress.create({ data }),
    ]);
    return { ok: true, address: created };
  }

  const created = await prisma.userAddress.create({ data });
  return { ok: true, address: created };
}

/* --------------------------------- UPDATE ----------------------------------- */
export async function updateUserAddress({
  userId,
  addressId,
  firstName,
  lastName,
  phone,
  email,
  address,
  isDefault, // optional; true -> make default
}) {
  req(userId, "userId");
  req(addressId, "addressId");

  const exists = await prisma.userAddress.findFirst({ where: { id: addressId, userId } });
  if (!exists) return { ok: false, error: "Address not found" };

  const patch = {};
  if (firstName !== undefined) patch.firstName = req(firstName, "firstName");
  if (lastName !== undefined) patch.lastName = req(lastName, "lastName");
  if (phone !== undefined) patch.phone = req(phone, "phone");
  if (email !== undefined) patch.email = trimOrNull(email);
  if (address !== undefined) patch.address = req(address, "address");

  if (isDefault === true) {
    const [, updated] = await prisma.$transaction([
      prisma.userAddress.updateMany({ where: { userId }, data: { isDefault: false } }),
      prisma.userAddress.update({ where: { id: addressId }, data: { ...patch, isDefault: true } }),
    ]);
    return { ok: true, address: updated };
  }

  // If explicitly trying to unset default (isDefault === false), we’ll allow it
  // only when another default exists; otherwise ignore to keep at least one default.
  if (isDefault === false && exists.isDefault) {
    const another = await prisma.userAddress.findFirst({
      where: { userId, id: { not: addressId }, isDefault: true },
    });
    if (another) patch.isDefault = false;
  }

  const updated = await prisma.userAddress.update({ where: { id: addressId }, data: patch });
  return { ok: true, address: updated };
}

/* ------------------------------- SET DEFAULT -------------------------------- */
export async function setDefaultUserAddress({ userId, addressId }) {
  req(userId, "userId");
  req(addressId, "addressId");

  const owns = await prisma.userAddress.findFirst({ where: { id: addressId, userId } });
  if (!owns) return { ok: false, error: "Address not found" };

  await prisma.$transaction([
    prisma.userAddress.updateMany({ where: { userId }, data: { isDefault: false } }),
    prisma.userAddress.update({ where: { id: addressId }, data: { isDefault: true } }),
  ]);

  return { ok: true };
}

/* ---------------------------------- DELETE ---------------------------------- */
export async function deleteUserAddress({ userId, addressId }) {
  req(userId, "userId");
  req(addressId, "addressId");

  const addr = await prisma.userAddress.findFirst({ where: { id: addressId, userId } });
  if (!addr) return { ok: false, error: "Address not found" };

  // Prevent deleting if used by orders (Order.addressId is REQUIRED in your design)
  const inUse = await prisma.order.count({ where: { addressId } });
  if (inUse > 0) {
    return { ok: false, code: "IN_USE", error: "Address is referenced by past orders and cannot be deleted." };
  }

  await prisma.userAddress.delete({ where: { id: addressId } });

  // Ensure at least one default remains if there are addresses left
  const hasDefault = await prisma.userAddress.findFirst({ where: { userId, isDefault: true } });
  if (!hasDefault) {
    const newest = await prisma.userAddress.findFirst({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });
    if (newest) {
      await prisma.userAddress.update({ where: { id: newest.id }, data: { isDefault: true } });
    }
  }

  return { ok: true };
}

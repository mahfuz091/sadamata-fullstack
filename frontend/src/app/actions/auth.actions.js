"use server";

import { removeAuthCookie, setAuthCookie, signAuthToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function registerUser(_, formData) {
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const email = formData.get("email");
  const phone = formData.get("phone");
  const password = formData.get("password");

  if (!password || (!email && !phone)) {
    return { success: false, message: "Email or phone and password required" };
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    if (existingUser) {
      return {
        success: false,
        message: "User with this email or phone already exists",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email: email || null,
        phone: phone || null,
        firstName,
        lastName,
        password: hashedPassword,
      },
    });

    const token = await signAuthToken({ userId: newUser.id });
    await setAuthCookie(token);

    return { success: true, message: "User registered successfully" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Registration failed" };
  }
}

export async function loginUser(_, formData) {
  const identifier = formData.get("identifier"); // email or phone
  const password = formData.get("password");

  if (!identifier || !password) {
    return { success: false, message: "Identifier and password are required" };
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { phone: identifier }],
      },
    });

    if (!user || !user.password) {
      return { success: false, message: "Invalid credentials" };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { success: false, message: "Invalid credentials" };
    }

    const token = await signAuthToken({ userId: user.id });
    await setAuthCookie(token);

    return { success: true, message: "Login successful" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Login failed" };
  }
}

export async function logoutUser() {
  try {
    await removeAuthCookie();
    return { success: true, message: "Logout successful" };
  } catch (error) {
    return { success: false, message: "Logout failed" };
  }
}

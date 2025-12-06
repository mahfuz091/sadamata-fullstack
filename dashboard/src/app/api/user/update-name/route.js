import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // adjust path if different

export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, name } = body || {};

    if (
      !userId ||
      !name ||
      typeof name !== "string" ||
      name.trim().length < 2
    ) {
      return NextResponse.json(
        { success: false, msg: "Invalid input" },
        { status: 400 }
      );
    }

    // Optional: check user exists
    const existing = await prisma.user.findUnique({ where: { id: userId } });
    if (!existing) {
      return NextResponse.json(
        { success: false, msg: "User not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { name: name.trim() },
      select: { id: true, name: true, email: true },
    });

    return NextResponse.json({
      success: true,
      msg: "Name updated",
      user: updated,
    });
  } catch (err) {
    console.error("API update-name error:", err);
    return NextResponse.json(
      { success: false, msg: "Server error" },
      { status: 500 }
    );
  }
}

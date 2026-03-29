"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function toggleFollowBrand(brandId) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "UNAUTHORIZED" };
    }

    const userId = session.user.id;

    const existingFollow = await prisma.brandFollow.findUnique({
      where: {
        userId_brandId: {
          userId,
          brandId,
        },
      },
    });

    let isFollowing = false;

    if (existingFollow) {
      // Unfollow
      await prisma.brandFollow.delete({
        where: {
          id: existingFollow.id,
        },
      });
      isFollowing = false;
    } else {
      // Follow
      await prisma.brandFollow.create({
        data: {
          userId,
          brandId,
        },
      });
      isFollowing = true;
    }

    revalidatePath(`/brand/${brandId}`);
    return { success: true, isFollowing };
  } catch (error) {
    console.error("Error in toggleFollowBrand:", error);
    return { success: false, error: "Something went wrong" };
  }
}

export async function getFollowStatus(brandId) {
  try {
    const session = await auth();
    if (!session?.user?.id) return false;

    const existingFollow = await prisma.brandFollow.findUnique({
      where: {
        userId_brandId: {
          userId: session.user.id,
          brandId,
        },
      },
    });

    return !!existingFollow;
  } catch (error) {
    console.error("Error in getFollowStatus:", error);
    return false;
  }
}

export async function getFollowerCount(brandId) {
  try {
    const count = await prisma.brandFollow.count({
      where: {
        brandId,
      },
    });
    return count;
  } catch (error) {
    console.error("Error in getFollowerCount:", error);
    return 0;
  }
}

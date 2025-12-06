"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signIn, signOut, auth } from "@/auth";

import { redirect } from "next/navigation";
import { Role } from "@/generated/prisma";

/** ---------- Register ---------- */
export const registerUser = async (_prevState, formData) => {
  try {
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    if (!name || !email || !password) {
      return { success: false, msg: "Required fields are missing" };
    }

    const existing = await prisma.user.findUnique({
      where: { email },
    });
    if (existing) {
      return { success: false, msg: "User already exists" };
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const created = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPass,
      },
      select: { id: true, name: true },
    });

    return {
      success: true,
      msg: `You are registered as ${created.name}. Please contact admin for activation`,
    };
  } catch (err) {
    console.error("registerUser error:", err);
    return { success: false, msg: "Something went wrong" };
  }
};

/** ---------- Login ---------- */
// export const loginUser = async (_prevState, formData) => {
//   try {
//     const email = formData.get("email");
//     const password = formData.get("password");

//     if (!email || !password) {
//       return { success: false, msg: "Email and password are required" };
//     }

//     const user = await prisma.user.findUnique({
//       where: { email },
//       select: { id: true, email: true, password: true },
//     });

//     if (!user) {
//       return { success: false, msg: "User doesnt exist, Please Register." };
//     }

//     const ok = await bcrypt.compare(password, user.password);
//     if (!ok) {
//       return { success: false, msg: "Password didnt match" };
//     }

//     await signIn("credentials", {
//       redirectTo: "/dashboard",
//       email,
//       password,
//     });

//     return { success: true, msg: "Logged in" };
//   } catch (err) {
//     const message =
//       typeof err?.message === "string" ? err.message : "Login failed";
//     console.error("loginUser error:", err);
//     return { success: false, msg: message };
//   }
// };
export const loginUser = async (_prevState, formData) => {
  try {
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
      return { success: false, msg: "Email and password are required" };
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, password: true },
    });

    if (!user) {
      return { success: false, msg: "User doesn't exist. Please Register." };
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return { success: false, msg: "Password didn't match" };
    }

    if (user.role !== "ADMIN") {
      return { success: false, msg: "You are not an admin" };
    }

    const response = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    // console.log("response", response);

    return { success: true, msg: "Login successful", userId: user.id };
  } catch (err) {
    console.error("loginUser error:", err);
    return { success: false, msg: "Something went wrong" };
  }
};
/** ---------- Logout ---------- */
export const logOut = async () => {
  try {
    await signOut({ redirect: false }); // don't let NextAuth auto-redirect
    return { success: true };
  } catch (err) {
    console.error("logOut error:", err);
    return { success: false };
  }
};

/** ---------- List Users ---------- */
/** ---------- List Users (safe) ---------- */
export const userList = async () => {
  try {
    // try the expected shape with createdAt
    try {
      const users = await prisma.user.findMany({
        where: {
          role: {
            notIn: [Role.BRAND, Role.MERCH],
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          role: true,
        },
        orderBy: { createdAt: "desc" },
      });
      return users;
    } catch (innerErr) {
      console.warn(
        "userList: fallback query due to:",
        innerErr?.message ?? innerErr
      );

      const users = await prisma.user.findMany({
        where: {
          role: {
            notIn: [Role.BRAND, Role.MERCH],
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });
      return users;
    }
  } catch (err) {
    console.error("userList error:", err);
    return [];
  }
};

export const brandList = async () => {
  try {
    // try the expected shape with createdAt
    try {
      const users = await prisma.user.findMany({
        where: { role: "BRAND" },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          role: true,
          brand: true,
          isActive: true,
        },
        orderBy: { createdAt: "desc" },
      });
      return users;
    } catch (innerErr) {
      // If ordering by createdAt isn't supported by the generated client,
      // fall back to a simpler query and return available fields.
      console.warn(
        "userList: fallback query due to:",
        innerErr?.message ?? innerErr
      );

      const users = await prisma.user.findMany({
        where: { role: "BRAND" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          brand: true,
          isActive: true,
        },
      });
      return users;
    }
  } catch (err) {
    console.error("userList error:", err);
    return [];
  }
};
export const merchList = async () => {
  try {
    // try the expected shape with createdAt
    try {
      const users = await prisma.user.findMany({
        where: { role: "Merch" },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          role: true,
          isActive: true,
          merchantProfile: true,
        },
        orderBy: { createdAt: "desc" },
      });
      return users;
    } catch (innerErr) {
      // If ordering by createdAt isn't supported by the generated client,
      // fall back to a simpler query and return available fields.
      console.warn(
        "userList: fallback query due to:",
        innerErr?.message ?? innerErr
      );

      const users = await prisma.user.findMany({
        where: { role: "MERCH" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          merchantProfile: true,
        },
      });
      return users;
    }
  } catch (err) {
    console.error("userList error:", err);
    return [];
  }
};

/** ---------- Get User Profile ---------- */
// export const getUserProfile = async () => {
//   try {
//     const session = await auth();
//     const email = session?.user?.email;
//     if (!email) return { user: null };

//     const user = await prisma.user.findUnique({
//       where: { email },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         createdAt: true,
//       },
//     });

//     return { user };
//   } catch (err) {
//     console.error("getUserProfile error:", err);
//     return { user: null };
//   }
// };

export const updateUserProfileImage = async (
  _prevState,
  { userId, imageUrl }
) => {
  if (!userId || !imageUrl) {
    throw new Error("User ID and image URL are required");
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { profileImage: imageUrl },
  });

  return updatedUser;
};

/** ---------- Update User Name ---------- */
export const updateUserName = async (_prevState, { userId, name }) => {
  try {
    if (!userId || !name) {
      return { success: false, msg: "User ID and name are required" };
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return { success: false, msg: "User not found" };
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name },
      select: { id: true, name: true, email: true },
    });

    return {
      success: true,
      msg: "Name updated successfully",
      user: updatedUser,
    };
  } catch (err) {
    console.error("updateUserName error:", err);
    return { success: false, msg: "Something went wrong" };
  }
};
/** ---------- Update Single User Role ---------- */
export const updateUserRole = async (_prevState, { userId, role }) => {
  try {
    // basic validation
    if (!userId || !role || typeof role !== "string") {
      return { success: false, msg: "User ID and role are required" };
    }

    // allowed roles (adjust to your app's roles)
    const ALLOWED_ROLES = ["USER", "ADMIN", "AUTHOR", "SUPERADMIN"];
    if (!ALLOWED_ROLES.includes(role)) {
      return {
        success: false,
        msg: `Invalid role. Allowed: ${ALLOWED_ROLES.join(", ")}`,
      };
    }

    // authorize: only admins can change roles
    const session = await auth();
    if (!session?.user) {
      return { success: false, msg: "Unauthorized" };
    }

    // if you store role on session.user.role; adjust the property name if different
    const callerRole = session.user.role ?? session.user?.roleName ?? null;
    console.log(session, "ca");
    if ((callerRole !== "ADMIN", callerRole !== "SUPERADMIN")) {
      return { success: false, msg: "Forbidden: admin only" };
    }

    // ensure target user exists
    const existing = await prisma.user.findUnique({ where: { id: userId } });
    if (!existing) {
      return { success: false, msg: "Target user not found" };
    }

    // update role
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role }, // adjust field name if your schema uses e.g. roles or roleId
      select: { id: true, name: true, email: true, role: true },
    });

    return { success: true, msg: "Role updated", user: updated };
  } catch (err) {
    console.error("updateUserRole error:", err);
    return { success: false, msg: "Something went wrong" };
  }
};

/** ---------- Bulk Update User Roles ---------- */
/**
 * payload: { updates: [{ userId, role }, ...] }
 * Example call: await updateUsersRoles(null, { updates: [{ userId: 'abc', role: 'admin' }] })
 */
export const updateUsersRoles = async (_prevState, { updates }) => {
  try {
    if (!Array.isArray(updates) || updates.length === 0) {
      return { success: false, msg: "Updates array required" };
    }

    // allowed roles (same as above)
    const ALLOWED_ROLES = ["user", "admin", "moderator"];

    // authorize: only admins
    const session = await auth();
    if (!session?.user) return { success: false, msg: "Unauthorized" };
    const callerRole = session.user.role ?? session.user?.roleName ?? null;
    if (callerRole !== "admin")
      return { success: false, msg: "Forbidden: admin only" };

    const results = [];
    for (const item of updates) {
      const { userId, role } = item || {};
      if (!userId || !role || !ALLOWED_ROLES.includes(role)) {
        results.push({ userId, success: false, msg: "Invalid input or role" });
        continue;
      }

      const existing = await prisma.user.findUnique({ where: { id: userId } });
      if (!existing) {
        results.push({ userId, success: false, msg: "User not found" });
        continue;
      }

      const updated = await prisma.user.update({
        where: { id: userId },
        data: { role },
        select: { id: true, name: true, email: true, role: true },
      });

      results.push({ userId, success: true, user: updated });
    }

    return { success: true, results };
  } catch (err) {
    console.error("updateUsersRoles error:", err);
    return { success: false, msg: "Something went wrong" };
  }
};
/** ---------- Admin / SuperAdmin Login ---------- */
export const adminLogin = async (_prevState, formData) => {
  try {
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
      return { success: false, msg: "Email and password are required" };
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
        profileImage: true,
      },
    });

    if (!user) {
      return { success: false, msg: "User not found" };
    }

    // Check if user is allowed (only ADMIN or SUPERADMIN)
    if (
      user.role !== "ADMIN" &&
      user.role !== "SUPERADMIN" &&
      user.role !== "AUTHOR"
    ) {
      return {
        success: false,
        msg: "Access denied. Only admins can log in here.",
      };
    }

    // Check password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return { success: false, msg: "Invalid password" };
    }

    // Sign in (NextAuth credentials provider)
    const response = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (response?.error) {
      return { success: false, msg: "Authentication failed" };
    }

    return {
      success: true,
      msg: "Admin login successful",
      userId: user.id,
      role: user.role,
    };
  } catch (err) {
    console.error("adminLogin error:", err);
    return { success: false, msg: "Something went wrong" };
  }
};

/** ---------- Delete User ---------- */
export const deleteUser = async (_prevState, { userId }) => {
  try {
    if (!userId) return { success: false, msg: "User ID required" };

    // authorize: only ADMIN or SUPERADMIN
    const session = await auth();
    if (!session?.user) return { success: false, msg: "Unauthorized" };
    const callerId = session.user.id;
    const callerRole = session.user.role;
    if (!["ADMIN", "SUPERADMIN"].includes(callerRole)) {
      return { success: false, msg: "Forbidden: admin only" };
    }

    // cannot delete yourself
    if (callerId === userId) {
      return { success: false, msg: "You cannot delete your own account" };
    }

    // check target
    const target = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });
    if (!target) return { success: false, msg: "User not found" };

    // only SUPERADMIN can delete SUPERADMIN
    if (target.role === "SUPERADMIN" && callerRole !== "SUPERADMIN") {
      return {
        success: false,
        msg: "Only SUPERADMIN can delete SUPERADMIN users",
      };
    }

    // delete related data if needed (cascade depends on your schema). Here we simply delete user.
    await prisma.user.delete({ where: { id: userId } });

    return { success: true, msg: "User deleted" };
  } catch (err) {
    console.error("deleteUser error:", err);
    return { success: false, msg: "Something went wrong" };
  }
};

/** ---------- Update User isActive ---------- */
export const updateUserIsActive = async (_prevState, { userId, isActive }) => {
  try {
    if (!userId || typeof isActive !== "boolean") {
      return {
        success: false,
        msg: "User ID and isActive(boolean) are required",
      };
    }

    // authorize: only ADMIN or SUPERADMIN
    const session = await auth();
    if (!session?.user) {
      return { success: false, msg: "Unauthorized" };
    }

    const callerRole = session.user.role;
    if (!["ADMIN", "SUPERADMIN"].includes(callerRole)) {
      return { success: false, msg: "Forbidden: admin only" };
    }

    // ensure target user exists
    const existing = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, isActive: true },
    });

    if (!existing) {
      return { success: false, msg: "User not found" };
    }

    // update isActive
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isActive },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
      },
    });

    return {
      success: true,
      msg: `User ${isActive ? "activated" : "deactivated"} successfully`,
      user: updatedUser,
    };
  } catch (err) {
    console.error("updateUserIsActive error:", err);
    return { success: false, msg: "Something went wrong" };
  }
};

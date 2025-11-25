"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs"; // for hashing passwords
import { signIn, signOut, auth } from "@/auth";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// helpers
function pick(...vals) {
  for (const v of vals)
    if (v != null && String(v).trim() !== "") return String(v).trim();
  return "";
}
const opt = (v) => (v && v.length ? v : null);
const toDate = (v) => (v ? new Date(v) : null);
const toLower = (v) => (v ? v.toLowerCase() : null);

export async function registerUser(formData) {
  try {
    // ---- core auth fields ----
    const name = pick(formData.get("name"), formData.get("full-name"));
    const emailRaw = pick(formData.get("email"));
    const phoneRaw = pick(formData.get("phone"), formData.get("call"));
    const password = pick(formData.get("password"));
    const confirmPassword = pick(formData.get("confirmPassword"));
    const roleRaw = pick(formData.get("role"));
    const role = (roleRaw || "USER").toUpperCase();

    if (!name || !password || !confirmPassword || !role) {
      return { success: false, message: "All required fields must be provided." };
    }
    if (password !== confirmPassword) {
      return { success: false, message: "Passwords do not match." };
    }
    if (!emailRaw && !phoneRaw) {
      return { success: false, message: "Either email or phone must be provided." };
    }
    if (!["USER", "ADMIN", "BRAND", "MERCH"].includes(role)) {
      return { success: false, message: "Invalid role." };
    }

    const email = toLower(emailRaw);
    const phone = phoneRaw || null;

    // ---- uniqueness ----
    const existing = await prisma.user.findFirst({
      where: { OR: [...(email ? [{ email }] : []), ...(phone ? [{ phone }] : [])] },
      select: { id: true },
    });
    if (existing) {
      return { success: false, message: "Email or phone already taken." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const isActive = !(role === "BRAND" || role === "MERCH");

    // ---- defaults for commissions (tweak as needed or load from env/config) ----
    const DEFAULT_BRAND_PCT = 10.0;
    const DEFAULT_MERCHANT_PCT = 10.0;

    // ---- merchant profile fields ----
    const fullName = name;
    const dateOfBirth = toDate(pick(formData.get("birth-yard"), formData.get("dateOfBirth")));
    const contactEmail = email;
    const contactPhone = phone;

    const nidOrPassportNo = opt(pick(formData.get("nid-number"), formData.get("nidOrPassportNo")));
    const presentAddress = opt(pick(formData.get("present-address"), formData.get("address"), formData.get("presentAddress")));
    const permanentAddress = opt(pick(formData.get("permanent-address"), formData.get("permanet-address"), formData.get("permanentAddress")));
    const portfolioUrl = opt(pick(formData.get("portfolio-link"), formData.get("portfolioUrl")));
    const websiteUrl = opt(pick(formData.get("web-link"), formData.get("websiteUrl")));
    const bankName = opt(pick(formData.get("bank-name"), formData.get("bankName")));
    const bankBranch = opt(pick(formData.get("branch-name"), formData.get("bankBranch")));
    const accountName = opt(pick(formData.get("account-name"), formData.get("accountName"), formData.get("full-name")));
    const accountNumber = opt(pick(formData.get("account-number"), formData.get("accountNumber")));
    const routingNumber = opt(pick(formData.get("routing-number"), formData.get("routingNumber")));
    const message = opt(pick(formData.get("message"), formData.get("massage")));

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { email, phone, name, password: hashedPassword, role, isActive },
      });

      let merchantProfile = null;
      let merchantCommissionPctNew = null; // <-- declare it

      if (role === "MERCH") {
        merchantProfile = await tx.merchantProfile.create({
          data: {
            user: { connect: { id: user.id } }, // use relation, not raw userId
            fullName,
            dateOfBirth,
            contactEmail,
            contactPhone,
            nidOrPassportNo,
            presentAddress,
            permanentAddress,
            portfolioUrl,
            websiteUrl,
            bankName,
            bankBranch,
            accountName,
            accountNumber,
            routingNumber,
            message,
          },
        });

        // CommissionSetting.merchantId must reference User.id (not MerchantProfile.id)
        merchantCommissionPctNew = await tx.commissionSetting.create({
          data: {
            brandId: null,
            merchantId: user.id,
            productId: null,
            brandCommissionPct: DEFAULT_BRAND_PCT,
            merchantCommissionPct: DEFAULT_MERCHANT_PCT,
            effectiveFrom: new Date(),
            isActive: true,
          },
        });
      }

      return { user, merchantProfile, merchantCommissionPctNew };
    });

    return {
      success: true,
      message:
        role === "MERCH" || role === "BRAND"
          ? "Registration submitted. Your account will be activated after review."
          : "Registration successful.",
      ...result,
    };
  } catch (error) {
    if (error && error.code === "P2002") {
      return { success: false, message: "Email or phone already taken." };
    }
    console.error("Error in user registration:", error);
    return { success: false, message: (error && error.message) || "Something went wrong." };
  }
}

// export async function registerUser(formData) {
//   try {
//     // Extract form data from the FormData object
//     const name = formData.get("name"); // Full name of the user
//     const email = formData.get("email"); // User email
//     const phone = formData.get("phone"); // User phone number
//     const password = formData.get("password"); // User password
//     const confirmPassword = formData.get("confirmPassword"); // Confirm password
//     const role = formData.get("role"); // User role (e.g., "BRAND", "USER")

//     // Basic validation: Ensure required fields are provided
//     if (!name || !password || !confirmPassword || !role) {
//       console.error("Validation error: All fields are required");
//       return { success: false, message: "All fields are required" };
//     }

//     // Password confirmation check
//     if (password !== confirmPassword) {
//       return { success: false, message: "Passwords do not match." };
//     }

//     // Validate if either email or phone is provided
//     if (!email && !phone) {
//       console.error("Validation error: Either email or phone must be provided");
//       return {
//         success: false,
//         message: "Either email or phone must be provided",
//       };
//     }
// if (!["USER", "ADMIN", "BRAND", "MERCH"].includes(role)) {
//       return { success: false, message: "Invalid role" };
//     }
//     // Check if the email or phone already exists in the database
//     let existingUser;
//     if (email) {
//       // If email is provided, check if email exists
//       existingUser = await prisma.user.findUnique({ where: { email } });
//     } else if (phone) {
//       // If phone is provided, check if phone exists
//       existingUser = await prisma.user.findUnique({ where: { phone } });
//     }

//     if (existingUser) {
//       console.error("User already exists:", email || phone);
//       return { success: false, message: "Email or phone already taken" };
//     }

//     // Hash the password before saving
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Handle default behavior for `isActive`
//     let isActive = true; // Default to true for `user` and `admin`
//     if (role === "BRAND" || role === "MERCH") {
//       isActive = false; // Set to false for `brand` and `merch`
//     }

//     // Determine the contact method (email or phone) to use
//     const contact = email || phone; // Prioritize email if both are provided

//     // Create the user in the database using Prisma
//     const user = await prisma.user.create({
//       data: {
//         email: email || null, // Store email if provided
//         phone: phone || null, // Store phone if provided
//         name,
//         password: hashedPassword, // Store hashed password
//         role,
//         isActive, // Set the isActive status based on role
//       },
//     });

//     return {
//       success: true,
//       user,
//       message: "Registration successful",
//     };
//   } catch (error) {
//     console.error("Error in user registration:", error);
//     return {
//       success: false,
//       message: error.message || "Something went wrong, please try again.",
//     };
//   }
// }

// login
export const loginUser = async (prevState, formData) => {
  const identifier = formData.get("identifier");
  const password = formData.get("password");

  if (!identifier) {
    return { success: false, message: "Email or phone is required" };
  }
  if (!password) {
    return { success: false, message: "Password is required" };
  }

  // Find user (email OR phone)
  const user = await prisma.user.findFirst({
    where: {
      AND: [
        { OR: [{ email: identifier }, { phone: identifier }] },
        { role: "MERCH" },
      ],
    },
  });

  // console.log(user, "user");

  if (!user) {
    return { success: false, message: "User not found" };
  }
  if (!user.isActive) {
    return {
      success: false,
      message: "Your account is not active. Please contact support.",
    };
  }
  if (user.role !== "MERCH") {
    return {
      success: false,
      message: "You are not authorized to access this portal.",
    };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return { success: false, message: "Invalid password" };
  }

  // NextAuth signIn
  const response = await signIn("credentials", {
    redirect: "/dashboard",
    identifier,
    password,
  });
};

// log out
export const logOut = async () => {
  await signOut();
  // redirect("/login");
  revalidatePath("/dashboard/*");
};

// export async function updateUserAccount(userId, action) {
//   try {
//     // Fetch the user from the database
//     const user = await prisma.user.findUnique({
//       where: { id: userId },
//     });

//     if (!user) {
//       throw new Error("User not found.");
//     }

//     // Ensure that the user is either a brand or merch account
//     if (user.role !== "BRAND" && user.role !== "MERCH") {
//       return {
//         success: false,
//         message: "This user is not a valid brand or merch account.",
//       };
//     }

//     // Only admins can change the isActive status
//     if (user.role !== "ADMIN") {
//       throw new Error("Only admins can update user account activation.");
//     }

//     // Based on action ('activate' or 'reject'), update isActive
//     const isActive = action === "activate" ? true : false;

//     // Update user account based on the action
//     const updatedUser = await prisma.user.update({
//       where: { id: userId },
//       data: { isActive },
//     });

//     return {
//       success: true,
//       message: `User account has been ${
//         action === "activate" ? "activated" : "rejected"
//       }.`,
//       user: updatedUser,
//     };
//   } catch (error) {
//     return {
//       success: false,
//       message: error.message || "Something went wrong",
//     };
//   }
// }

// export async function loginUser(formData) {
//   try {
//     const email = formData.get("email"); // User email
//     const phone = formData.get("phone"); // User phone number
//     const password = formData.get("password"); // User password

//     // Basic validation: Ensure password is provided
//     if (!password) {
//       console.error("Validation error: Password is required.");
//       return { success: false, message: "Password is required" };
//     }

//     // Check if either email or phone is provided
//     if (!email && !phone) {
//       console.error("Validation error: Either email or phone is required.");
//       return { success: false, message: "Either email or phone is required" };
//     }

//     // Find the user based on email or phone
//     let user;
//     if (email) {
//       // If email is provided, check if email exists
//       user = await prisma.user.findUnique({ where: { email } });
//     } else if (phone) {
//       // If phone is provided, check if phone exists
//       user = await prisma.user.findUnique({ where: { phone } });
//     }

//     if (!user) {
//       console.error("User not found:", email || phone);
//       return { success: false, message: "User not found" };
//     }

//     // Check if the user is active (if not, deny login)
//     // if (!user.isActive) {
//     //   return {
//     //     success: false,
//     //     message: "Your account is inactive. Please contact support.",
//     //   };
//     // }

//     // Compare the provided password with the stored hashed password
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return { success: false, message: "Invalid password" };
//     }

//     // Generate JWT token upon successful login
//     const tokenPayload = { userId: user.id, role: user.role };
//     const token = await signAuthToken(tokenPayload);

//     // Set JWT token in the cookie
//     await setAuthCookie(token);

//     return {
//       success: true,
//       message: "Login successful",
//       user,
//     };
//   } catch (error) {
//     console.error("Error during login:", error);
//     return {
//       success: false,
//       message: error.message || "Something went wrong, please try again.",
//     };
//   }
// }

// export async function logoutUser() {
//   try {
//     // Remove JWT token from the cookie
//     await removeAuthCookie();

//     return {
//       success: true,
//       message: "Logout successful",
//     };
//   } catch (error) {
//     console.error("Error during logout:", error);
//     return {
//       success: false,
//       message: error.message || "Something went wrong, please try again.",
//     };
//   }
// }

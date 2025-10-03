"use server";

import  prisma  from "@/lib/prisma";
import { AuthError } from "next-auth";
import bcrypt from "bcryptjs"; // for hashing passwords
import { signIn, signOut, auth } from "@/auth";

import { revalidatePath } from "next/cache";

export async function registerUser(prevState, formData) {
  try {
    const name = (formData.get("name") || "").toString().trim();
    const email = (formData.get("email") || "").toString().trim() || null;
    const phone = (formData.get("phone") || "").toString().trim() || null;
    const password = (formData.get("password") || "").toString();
    const confirmPassword = (formData.get("confirmPassword") || "").toString();
    let role = ((formData.get("role") || "USER").toString() || "USER").toUpperCase();

    if (!name || !password || !confirmPassword || (!email && !phone)) {
      return { success: false, message: "All fields are required" };
    }
    if (password !== confirmPassword) {
      return { success: false, message: "Passwords do not match." };
    }

    // Uniqueness check
    let existingUser = null;
    if (email) {
      existingUser = await prisma.user.findUnique({ where: { email } });
    } else if (phone) {
      existingUser = await prisma.user.findUnique({ where: { phone } });
    }
    if (existingUser) {
      return { success: false, message: "Email or phone already taken" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Activation logic
    let isActive = true;
    if (role === "BRAND" || role === "MERCH") {
      isActive = false;
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        role,
        isActive,
      },
    });

    return { success: true, user, message: "Registration successful" };
  } catch (error) {
    console.error("Error in user registration:", error);
    return {
      success: false,
      message: error?.message || "Something went wrong, please try again.",
    };
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
//     // const role = formData.get("role"); // User role (e.g., "BRAND", "USER")

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
// export const loginUser = async (prevState, formData) => {
//   const identifier = formData.get("identifier");
//   const password = formData.get("password");

//   if (!identifier) {
//     return { success: false, message: "Email or phone is required" };
//   }
//   if (!password) {
//     return { success: false, message: "Password is required" };
//   }

//   // Find user (email OR phone)
//   const user = await prisma.user.findFirst({
//     where: {
//       AND: [
//         { OR: [{ email: identifier }, { phone: identifier }] },
//         { role: "USER" },
//       ],
//     },
//   });

//   console.log(user, "user");

//   if (!user) {
//     return { success: false, message: "User not found" };
//   }
//   if (!user.isActive) {
//     return {
//       success: false,
//       message: "Your account is not active. Please contact support.",
//     };
//   }
  

//   const isPasswordValid = await bcrypt.compare(password, user.password);
//   if (!isPasswordValid) {
//     return { success: false, message: "Invalid password" };
//   }

//   // NextAuth signIn
//   const response = await signIn("credentials", {
//     redirect: "/dashboard",
//     identifier,
//     password,
//   });
// };

// log out
export const logOut = async () => {
  await signOut();
  // redirect("/login");
  revalidatePath("/dashboard/*");
};
// export const loginUser = async (prevState, formData) => {
//   const identifier = formData.get("identifier");
//   const password = formData.get("password");

//   if (!identifier) {
//     return { success: false, message: "Email or phone is required" };
//   }
//   if (!password) {
//     return { success: false, message: "Password is required" };
//   }

//   const user = await prisma.user.findFirst({
//     where: {
//       AND: [
//         { OR: [{ email: identifier }, { phone: identifier }] },
//         { role: "USER" },
//       ],
//     },
//   });

//   console.log(user, "user");

//   if (!user) {
//     return { success: false, message: "User not found" };
//   }
  


//   const isPasswordValid = await bcrypt.compare(password, user.password);
//   if (!isPasswordValid) {
//     return { success: false, message: "Invalid password" };
//   }


//   const response = await signIn("credentials", {
//     identifier,
//     password,
    
//   });
//   return { success: true , message: "Login successful" };
// };
export const loginUser = async (prevState, formData) => {
  try {
    const identifier = formData.get("identifier");
    const password = formData.get("password");
    const redirectRaw = formData.get("redirect") || "/";
    const redirectTo =
      typeof redirectRaw === "string" && redirectRaw.startsWith("/") ? redirectRaw : "/";

    if (!identifier) return { success: false, message: "Email or phone is required" };
    if (!password) return { success: false, message: "Password is required" };

    // (Your pre-check; optional—see note below)
    const user = await prisma.user.findFirst({
      where: { AND: [{ OR: [{ email: identifier }, { phone: identifier }] }, { role: "USER" }] },
    });
    if (!user) return { success: false, message: "User not found" };

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return { success: false, message: "Invalid password" };

    // NextAuth signIn — on success this will THROW a NEXT_REDIRECT
    await signIn("credentials", { identifier, password, redirectTo });

    // Unreachable on success (redirect already happened); kept for completeness
    return { success: true, message: "Login successful" };
  } catch (error) {
    // Handle *auth failures* only
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return { success: false, message: "Invalid email/phone or password" };
      }
      return { success: false, message: "Authentication failed. Please try again." };
    }
    // IMPORTANT: let NEXT_REDIRECT bubble (do NOT swallow it)
    throw error;
  }
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

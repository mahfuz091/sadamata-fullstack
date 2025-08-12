"use server";
import { removeAuthCookie, setAuthCookie, signAuthToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs"; // for hashing passwords

// export async function registerUser(formData) {
//   try {
//     // Extract form data from the FormData object
//     const name = formData.get("name"); // Full name of the user
//     const email = formData.get("email"); // User email
//     const phone = formData.get("phone"); // User phone number
//     const password = formData.get("password"); // User password
//     const confirmPassword = formData.get("confirmPassword"); // Confirm password
//     const role = formData.get("role"); // User role (e.g., "BRAND", "USER")

//     // Basic validation: Ensure all required fields are provided
//     if (!name || !password || !confirmPassword || !role) {
//       console.error("Validation error: All fields are required");
//       return { success: false, message: "All fields are required" };
//     }

//     // Password confirmation check
//     if (password !== confirmPassword) {
//       return { success: false, message: "Passwords do not match." };
//     }

//     // Check if the email already exists in the database
//     const existingUser = await prisma.user.findUnique({
//       where: { email },
//     });
//     if (existingUser) {
//       console.error("User already exists:", email);
//       return { success: false, message: "Email already taken" };
//     }

//     // Hash the password before saving
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Handle default behavior for `isActive`
//     let isActive = true; // Default to true for `user` and `admin`
//     if (role === "BRAND" || role === "MERCH") {
//       isActive = false; // Set to false for `brand` and `merch`
//     }

//     // Create the user in the database using Prisma
//     const user = await prisma.user.create({
//       data: {
//         email,
//         phone,
//         name,
//         password: hashedPassword, // Store hashed password
//         role,
//         isActive: isActive, // Set isActive based on the role
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

export async function registerUser(formData) {
  try {
    // Extract form data from the FormData object
    const name = formData.get("name"); // Full name of the user
    const email = formData.get("email"); // User email
    const phone = formData.get("phone"); // User phone number
    const password = formData.get("password"); // User password
    const confirmPassword = formData.get("confirmPassword"); // Confirm password
    const role = formData.get("role"); // User role (e.g., "BRAND", "USER")

    // Basic validation: Ensure required fields are provided
    if (!name || !password || !confirmPassword || !role) {
      console.error("Validation error: All fields are required");
      return { success: false, message: "All fields are required" };
    }

    // Password confirmation check
    if (password !== confirmPassword) {
      return { success: false, message: "Passwords do not match." };
    }

    // Validate if either email or phone is provided
    if (!email && !phone) {
      console.error("Validation error: Either email or phone must be provided");
      return {
        success: false,
        message: "Either email or phone must be provided",
      };
    }

    // Check if the email or phone already exists in the database
    let existingUser;
    if (email) {
      // If email is provided, check if email exists
      existingUser = await prisma.user.findUnique({ where: { email } });
    } else if (phone) {
      // If phone is provided, check if phone exists
      existingUser = await prisma.user.findUnique({ where: { phone } });
    }

    if (existingUser) {
      console.error("User already exists:", email || phone);
      return { success: false, message: "Email or phone already taken" };
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Handle default behavior for `isActive`
    let isActive = true; // Default to true for `user` and `admin`
    if (role === "BRAND" || role === "MERCH") {
      isActive = false; // Set to false for `brand` and `merch`
    }

    // Determine the contact method (email or phone) to use
    const contact = email || phone; // Prioritize email if both are provided

    // Create the user in the database using Prisma
    const user = await prisma.user.create({
      data: {
        email: email || null, // Store email if provided
        phone: phone || null, // Store phone if provided
        name,
        password: hashedPassword, // Store hashed password
        role,
        isActive: isActive, // Set isActive based on the role
      },
    });

    // If the user role is BRAND, automatically create a Brand
    if (role === "BRAND") {
      await prisma.brand.create({
        data: {
          name: `${name}`, // You can customize the brand name
          userId: user.id, // Link the Brand to the User
        },
      });
    }

    return {
      success: true,
      user,
      message: "Registration successful",
    };
  } catch (error) {
    console.error("Error in user registration:", error);
    return {
      success: false,
      message: error.message || "Something went wrong, please try again.",
    };
  }
}

export async function updateUserAccount(userId, action) {
  try {
    // Fetch the user from the database
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found.");
    }

    // Ensure that the user is either a brand or merch account
    if (user.role !== "BRAND" && user.role !== "MERCH") {
      return {
        success: false,
        message: "This user is not a valid brand or merch account.",
      };
    }

    // Only admins can change the isActive status
    if (user.role !== "ADMIN") {
      throw new Error("Only admins can update user account activation.");
    }

    // Based on action ('activate' or 'reject'), update isActive
    const isActive = action === "activate" ? true : false;

    // Update user account based on the action
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isActive },
    });

    return {
      success: true,
      message: `User account has been ${
        action === "activate" ? "activated" : "rejected"
      }.`,
      user: updatedUser,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
}

export async function loginUser(formData) {
  try {
    const email = formData.get("email"); // User email
    const phone = formData.get("phone"); // User phone number
    const password = formData.get("password"); // User password

    // Basic validation: Ensure password is provided
    if (!password) {
      console.error("Validation error: Password is required.");
      return { success: false, message: "Password is required" };
    }

    // Check if either email or phone is provided
    if (!email && !phone) {
      console.error("Validation error: Either email or phone is required.");
      return { success: false, message: "Either email or phone is required" };
    }

    // Find the user based on email or phone
    let user;
    if (email) {
      // If email is provided, check if email exists
      user = await prisma.user.findUnique({ where: { email } });
    } else if (phone) {
      // If phone is provided, check if phone exists
      user = await prisma.user.findUnique({ where: { phone } });
    }

    if (!user) {
      console.error("User not found:", email || phone);
      return { success: false, message: "User not found" };
    }

    // Check if the user is active (if not, deny login)
    if (!user.isActive) {
      return {
        success: false,
        message: "Your account is inactive. Please contact support.",
      };
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { success: false, message: "Invalid password" };
    }

    // Generate JWT token upon successful login
    const tokenPayload = { userId: user.id, role: user.role };
    const token = await signAuthToken(tokenPayload);

    // Set JWT token in the cookie
    await setAuthCookie(token);

    return {
      success: true,
      message: "Login successful",
      user,
    };
  } catch (error) {
    console.error("Error during login:", error);
    return {
      success: false,
      message: error.message || "Something went wrong, please try again.",
    };
  }
}

export async function logoutUser() {
  try {
    // Remove JWT token from the cookie
    await removeAuthCookie();

    return {
      success: true,
      message: "Logout successful",
    };
  } catch (error) {
    console.error("Error during logout:", error);
    return {
      success: false,
      message: error.message || "Something went wrong, please try again.",
    };
  }
}

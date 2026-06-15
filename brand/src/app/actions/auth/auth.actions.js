"use server";
import { removeAuthCookie, setAuthCookie, signAuthToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateBrandSlug } from "@/lib/brandSlug";
import { signIn, signOut, auth } from "@/auth";
import bcrypt from "bcryptjs"; // for hashing passwords
import { redirect } from "next/navigation";
// helpers
function pick(...vals) {
  for (const v of vals)
    if (v != null && String(v).trim() !== "") return String(v).trim();
  return "";
}
const opt = (v) => (v && v.length ? v : null);
const toDate = (v) => (v ? new Date(v) : null);
const toLower = (v) => (v ? v.toLowerCase() : null);
const normalizeIdentifier = (v) => {
  const value = pick(v);
  return value.includes("@") ? value.toLowerCase() : value;
};



// export async function registerUser(formData) {
//   try {
//     // ---- core auth fields (accept multiple input-name variants) ----
//     const name = pick(formData.get("name"), formData.get("full-name"));
//     const emailRaw = pick(formData.get("email"));
//     const phoneRaw = pick(formData.get("phone"), formData.get("call"));
//     const password = pick(formData.get("password"));
//     const confirmPassword = pick(formData.get("confirmPassword"));
//     const roleRaw = pick(formData.get("role"));
//     const role = (roleRaw || "USER").toUpperCase();
//     const brandCategoryIdRaw = pick(formData.get("brandCategoryId"));
//     const brandCategoryId = opt(brandCategoryIdRaw); // null if empty string
//     const industryType = pick(formData.get("industryType"));
//     const socialProfile = pick(formData.get("socialProfileLink"));
//     // âœ… exclusive flag (supports both "isExclusive" and "plan"/"brand-plan")
//     const exclusiveRaw = pick(
//       formData.get("isExclusive"),
//       formData.get("plan"),
//       formData.get("brand-plan")
//     );
//     const isExclusive =
//       exclusiveRaw === "true" || exclusiveRaw === "exclusive" ? true : false;
//     console.log(socialProfile, brandCategoryId, industryType, "is");

//     if (!name || !password || !confirmPassword || !role) {
//       return {
//         success: false,
//         message: "All required fields must be provided.",
//       };
//     }
//     if (password !== confirmPassword) {
//       return { success: false, message: "Passwords do not match." };
//     }
//     if (!emailRaw && !phoneRaw) {
//       return {
//         success: false,
//         message: "Either email or phone must be provided.",
//       };
//     }
//     if (!["USER", "ADMIN", "BRAND", "MERCH"].includes(role)) {
//       return { success: false, message: "Invalid role." };
//     }

//     const email = emailRaw ? toLower(emailRaw) : null;
//     const phone = phoneRaw || null;

//     // ---- uniqueness check (email OR phone) ----
//     const existing = await prisma.user.findFirst({
//       where: {
//         OR: [...(email ? [{ email }] : []), ...(phone ? [{ phone }] : [])],
//       },
//       select: { id: true },
//     });
//     if (existing) {
//       return { success: false, message: "Email or phone already taken." };
//     }

//     // âœ… If brandCategoryId provided, check it exists (avoid connect error)
//     if (role === "BRAND" && brandCategoryId) {
//       const cat = await prisma.brandCategory.findUnique({
//         where: { id: brandCategoryId },
//         select: { id: true },
//       });
//       if (!cat) {
//         return { success: false, message: "Invalid brand category." };
//       }
//     }


//     const hashedPassword = await bcrypt.hash(password, 10);
//     const isActive = !(role === "BRAND" || role === "MERCH"); // merch/brand require review

//     // ---- collect ALL MerchantProfile fields (from your form names) ----

//     const dateOfBirth = toDate(
//       pick(formData.get("birth-yard"), formData.get("dateOfBirth"))
//     );
//     const contactEmail = email;
//     const contactPhone = phone;

//     const nidOrPassportNo = opt(
//       pick(formData.get("nid-number"), formData.get("nidOrPassportNo"))
//     );
//     const presentAddress = opt(
//       pick(
//         formData.get("present-address"),
//         formData.get("address"),
//         formData.get("presentAddress")
//       )
//     );
//     const permanentAddress = opt(
//       pick(
//         formData.get("permanent-address"),
//         formData.get("permanet-address"),
//         formData.get("permanentAddress")
//       )
//     );

//     const portfolioUrl = opt(
//       pick(formData.get("portfolio-link"), formData.get("portfolioUrl"))
//     );
//     const websiteUrl = opt(
//       pick(formData.get("web-link"), formData.get("websiteUrl"))
//     );

//     const bankName = opt(
//       pick(formData.get("bank-name"), formData.get("bankName"))
//     );
//     const bankBranch = opt(
//       pick(formData.get("branch-name"), formData.get("bankBranch"))
//     );
//     const accountName = opt(
//       pick(
//         formData.get("account-name"),
//         formData.get("accountName"),
//         formData.get("full-name")
//       )
//     );
//     const accountNumber = opt(
//       pick(formData.get("account-number"), formData.get("accountNumber"))
//     );
//     const routingNumber = opt(
//       pick(formData.get("routing-number"), formData.get("routingNumber"))
//     );

//     const message = opt(pick(formData.get("message"), formData.get("massage"))); // textarea id was "massage"

//     // if (role === "BRAND" && !brandCategoryId) {
//     //   return {
//     //     success: false,
//     //     message: "Brand category is required for brand registration.",
//     //   };
//     // }


    
//     // If BRAND, required in your schema
//     if (role === "BRAND") {
//       if (!industryType) {
//         return { success: false, message: "Industry type is required for brand registration." };
//       }
//       if (!socialProfile) {
//         return { success: false, message: "Social profile link is required for brand registration." };
//       }
//     }

//     // ---- create user (+ merchant profile if role is MERCH) ----
//     const result = await prisma.$transaction(async (tx) => {
//       const user = await tx.user.create({
//         data: {
//           email,
//           phone,
//           name,
//           password: hashedPassword,
//           role,
//           isActive,
//         },
//       });

//       let brandProfile = null;

//       if (role === "BRAND") {
//         const brandCategoryRelation = brandCategoryId
//   ? { connect: { id: brandCategoryId } }
//   : undefined;
//         brandProfile = await tx.brand.create({
//           data: {
//             user: {
//               connect: { id: user.id },
//             },
//             name,
//             dateOfBirth,
//             contactEmail,
//             contactPhone,
//             nidOrPassportNo,
//             presentAddress,
//             permanentAddress,
//             portfolioUrl,
//             websiteUrl,
//             bankName,
//             bankBranch,
//             accountName,
//             accountNumber,
//             routingNumber,
//             message,
//             socialProfile,
//             industryType,
//              isExclusive, // âœ… IMPORTANT

//             // âœ… ONLY connect if brandCategoryId exists
//             ...(brandCategoryRelation ? { brandCategory: brandCategoryRelation } : {}),
//           },
//         });

//         await tx.commissionSetting.create({
//           data: {
//             brandId: brandProfile.id,
//             merchantId: null,
//             productId: null,
//             brandCommissionPct: brandProfile.defaultBrandPct ?? 6.0,
//             merchantCommissionPct: brandProfile.defaultMerchantPct ?? 6.0,
//             effectiveFrom: new Date(),
//             isActive: true,
//           },
//         });
//       }

//       return { user, brandProfile };
//     });

//     return {
//       success: true,
//       message:
//         role === "MERCH" || role === "BRAND"
//           ? "Registration submitted. Your account will be activated after review."
//           : "Registration successful.",
//       ...result,
//     };
//   } catch (error) {
//     if (error && error.code === "P2002") {
//       return { success: false, message: "Email or phone already taken." };
//     }
//     console.error("Error in user registration:", error);
//     return {
//       success: false,
//       message: (error && error.message) || "Something went wrong.",
//     };
//   }
// }

export async function registerUser(formData) {
  try {
    const name = pick(formData.get("name"), formData.get("full-name"));
    const emailRaw = pick(formData.get("email"));
    const phoneRaw = pick(formData.get("phone"), formData.get("call"));
    const password = pick(formData.get("password"));
    const confirmPassword = pick(formData.get("confirmPassword"));
    const roleRaw = pick(formData.get("role"));
    const role = (roleRaw || "USER").toUpperCase();

    // âœ… optional category
    const brandCategoryId = opt(pick(formData.get("brandCategoryId")));

    const industryType = opt(pick(formData.get("industryType")));
    const socialProfile = opt(pick(formData.get("socialProfileLink")));

    // âœ… exclusive
    const exclusiveRaw = pick(
      formData.get("isExclusive"),
      formData.get("plan"),
      formData.get("brand-plan")
    );
    const isExclusive =
      exclusiveRaw === "true" || exclusiveRaw === "exclusive" ? true : false;

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

    // âœ… make email safe
    const email = emailRaw ? toLower(emailRaw) : null;
    const phone = phoneRaw || null;

    // BRAND required fields (your Brand model needs these)
    if (role === "BRAND") {
      if (!email) return { success: false, message: "Email is required for brand registration." };
      if (!phone) return { success: false, message: "Phone is required for brand registration." };
      if (!industryType) return { success: false, message: "Industry type is required for brand registration." };
      if (!socialProfile) return { success: false, message: "Social profile link is required for brand registration." };
    }

    // ---- uniqueness check (email OR phone) ----
    const existing = await prisma.user.findFirst({
      where: { OR: [...(email ? [{ email }] : []), ...(phone ? [{ phone }] : [])] },
      select: { id: true },
    });
    if (existing) {
      return { success: false, message: "Email or phone already taken." };
    }

    // âœ… If category id is provided, validate exists (still optional)
    if (role === "BRAND" && brandCategoryId) {
      const cat = await prisma.brandCategory.findUnique({
        where: { id: brandCategoryId },
        select: { id: true },
      });
      if (!cat) return { success: false, message: "Invalid brand category." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const isActive = !(role === "BRAND" || role === "MERCH");

    const dateOfBirth = toDate(
      pick(formData.get("birth-yard"), formData.get("dateOfBirth"))
    );

    const contactEmail = email; // required for Brand
    const contactPhone = phone; // required for Brand

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

      let brandProfile = null;

      if (role === "BRAND") {
        const defaultBrandPct = isExclusive ? 10 : 6;
  const defaultMerchantPct = 6;
        const brandSlug = await generateBrandSlug(tx, name);
        brandProfile = await tx.brand.create({
          data: {
            user: { connect: { id: user.id } },
            name,
            brandSlug,
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
            socialProfile,
            industryType,
            isExclusive,

            // âœ… set defaults based on isExclusive
      defaultBrandPct,
      defaultMerchantPct,

            // âœ… optional connect
            ...(brandCategoryId
              ? { brandCategory: { connect: { id: brandCategoryId } } }
              : {}),
          },
        });

        await tx.commissionSetting.create({
          data: {
            brandId: brandProfile.id,
            merchantId: null,
            productId: null,
            brandCommissionPct: brandProfile.defaultBrandPct ?? 6.0,
            merchantCommissionPct: brandProfile.defaultMerchantPct ?? 6.0,
            effectiveFrom: new Date(),
            isActive: true,
          },
        });
      }

      return { user, brandProfile };
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

// export async function loginUser(_prevState, formData) {
//   const identifier = normalizeIdentifier(formData.get("identifier"));
//   const password = formData.get("password");

//   if (!identifier) return { success: false, message: "Email or phone is required" };
//   if (!password) return { success: false, message: "Password is required" };

//   // à¦¸à¦«à¦² à¦¹à¦²à§‡ Next.js à¦¸à¦¾à¦°à§à¦­à¦¾à¦° à¦…à§à¦¯à¦¾à¦•à¦¶à¦¨ à¦…à¦Ÿà§‹-à¦°à¦¿à¦¡à¦¾à¦‡à¦°à§‡à¦•à§à¦Ÿ à¦¥à§à¦°à§‹ à¦•à¦°à¦¬à§‡
//   await signIn("credentials", {
//     identifier,
//     password,
//     redirectTo: "/dashboard",
//   });

//   // à¦¸à¦¾à¦§à¦¾à¦°à¦£à¦¤ à¦à¦–à¦¾à¦¨à§‡ à¦à¦•à§à¦¸à¦¿à¦•à¦¿à¦‰à¦¶à¦¨ à¦ªà§Œà¦à¦›à¦¾à§Ÿ à¦¨à¦¾ (à¦°à¦¿à¦¡à¦¾à¦‡à¦°à§‡à¦•à§à¦Ÿ à¦¹à§Ÿà§‡ à¦¯à¦¾à§Ÿ)
//   return { success: true, message: "Logged in" };
// }

// export const loginUser = async (prevState, formData) => {
//   const identifier = normalizeIdentifier(formData.get("identifier"));
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
//         { role: "BRAND" },
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
//   if (user.role !== "BRAND") {
//     return {
//       success: false,
//       message: "You are not authorized to access this portal.",
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

export const loginUser = async (prevState, formData) => {
  const identifier = normalizeIdentifier(formData.get("identifier"));
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
        { role: "BRAND" },
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
  if (user.role !== "BRAND") {
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
    redirect: false,
    identifier,
    password,
  });
  redirect("/dashboard");
  // return {
  //   success: true,
  //   message: "Login successful",
  //   user,
  // };
};
export const logOut = async () => {
  await signOut();
  // redirect("/login");
  revalidatePath("/dashboard/*");
};
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


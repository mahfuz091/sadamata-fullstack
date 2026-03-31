"use server";
import { prisma } from "@/lib/prisma"; // Assuming you are using Prisma ORM
import { saveBrandBannerFileS3 } from "@/lib/s3helper";
import { revalidatePath } from "next/cache";
// Import the function for saving the banner image

// Function to update the brand banner and social media links
export async function updateBrand(formData) {
  try {
    const brandId = formData.get("brandId");
    const bannerFile = formData.get("bannerFile");
    const youtubeLink = formData.get("youtubeLink");
    const facebookLink = formData.get("facebookLink");
    const twitterLink = formData.get("twitterLink");
    const instagramLink = formData.get("instagramLink");
    const linkedinLink = formData.get("linkedinLink");
    const tiktokLink = formData.get("tiktokLink");
    const bannerPosition = formData.get("bannerPosition");

    console.log("Updating Brand:", { brandId, bannerPosition, facebookLink });

    if (!brandId) throw new Error("Brand ID is required");

    // Handle file upload if there is a new banner file
    let bannerImageUrl = null;
    const isFile = (f) => f && typeof f.size === "number" && f.size > 0;

    if (isFile(bannerFile)) {
      // Upload the banner image to S3 and get the image URL
      bannerImageUrl = await saveBrandBannerFileS3(bannerFile, brandId, "brand-banner");
    }

    // Update the brand record in the database
    await prisma.brand.update({
      where: { id: brandId },
      data: {
        bannerImage: bannerImageUrl || undefined,
        facebookLink: facebookLink ?? undefined,
        twitterLink: twitterLink ?? undefined,
        instagramLink: instagramLink ?? undefined,
        linkedinLink: linkedinLink ?? undefined,
        youtubeLink: youtubeLink ?? undefined,
        tiktokLink: tiktokLink ?? undefined,

        bannerPosition: bannerPosition ?? undefined,
      },
    });

    revalidatePath("/dashboard/brand");
    revalidatePath("/dashboard/brand", "page");

    return { success: true, message: "Brand updated successfully" };
  } catch (error) {
    console.error("Error updating brand:", error);
    return {
      success: false,
      message: error?.message || "Something went wrong, please try again.",
    };
  }
};
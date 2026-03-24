import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Initialize AWS S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Function to upload a file to S3
export const uploadToS3 = async ({ key, body, contentType }) => {
  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET,
        Key: key,
        Body: body,
        ContentType: contentType, // Set the content type (MIME type)
        ACL: "public-read", // Make the file publicly accessible
      })
    );
    return key; // Return the key (file path in S3)
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw new Error("Failed to upload file to S3");
  }
};

// Function to generate a presigned URL for a file in S3
export const getPrivateUrl = async (key, expiresIn = 3600) => {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: key,
    });
    // Generate and return a presigned URL
    return await getSignedUrl(s3, command, { expiresIn });
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    throw new Error("Failed to generate presigned URL");
  }
};

// Function to delete a file from S3
export const deleteFromS3 = async (key) => {
  try {
    if (!key) return; // Ensure key exists
    if (/^https?:\/\//i.test(key)) return; // Skip if it's a full URL (not a file path)

    const Key = key.replace(/^\/+/, ""); // Remove any leading slashes

    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET,
        Key,
      })
    );
  } catch (error) {
    console.error("Error deleting file from S3:", error);
    throw new Error("Failed to delete file from S3");
  }
};
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function uploadToS3({ key, body, contentType }) {
  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );
  return key; // store this in DB
}

export async function getPrivateUrl(key, expiresIn = 3600) {
  return await getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: process.env.AWS_BUCKET, Key: key }),
    { expiresIn }
  );
}

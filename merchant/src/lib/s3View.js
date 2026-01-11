import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "@/lib/s3";

const BUCKET = process.env.AWS_S3_BUCKET;

export async function getSignedS3Url(key, expiresIn = 60 * 60) {
  if (!key) return null;

  // already full url হলে 그대로 ফেরত
  if (/^https?:\/\//i.test(key)) return key;

  const cmd = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key.replace(/^\/+/, ""),
  });

  return await getSignedUrl(s3, cmd, { expiresIn });
}

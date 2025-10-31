import {
  S3Client,
  PutObjectCommand,
  CopyObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Cloudflare R2 is S3-compatible, so we use the AWS SDK with R2 endpoint
const r2Endpoint = process.env.R2_ENDPOINT || process.env.S3_ENDPOINT;
const r2Region = process.env.R2_REGION || "auto"; // R2 uses "auto" region

export const s3 = new S3Client({
  region: r2Region,
  endpoint: r2Endpoint,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export async function presignPut(
  key: string,
  contentType: string,
  expiresSec = 300
) {
  const cmd = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET || process.env.S3_BUCKET!,
    Key: key,
    ContentType: contentType,
  });
  return getSignedUrl(s3, cmd, { expiresIn: expiresSec });
}

export function publicUrl(key: string) {
  const baseUrl = process.env.R2_PUBLIC_BASE || process.env.S3_PUBLIC_BASE || "";
  return `${baseUrl}/${encodeURI(key)}`;
}

export async function copyTo(
  keySrc: string,
  keyDst: string,
  contentType = "video/mp4"
) {
  const bucket = process.env.R2_BUCKET || process.env.S3_BUCKET!;
  const cmd = new CopyObjectCommand({
    Bucket: bucket,
    Key: keyDst,
    CopySource: `/${bucket}/${keySrc}`,
    // R2 doesn't support ACL, so we remove it
    ContentType: contentType,
  });
  await s3.send(cmd);
}

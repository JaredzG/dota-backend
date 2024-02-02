import * as fs from "fs";
import { S3Client } from "@aws-sdk/client-s3";

const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME ?? "lotus-app-images";
const S3_BUCKET_REGION = process.env.S3_BUCKET_REGION ?? "us-east-2";
const S3_BUCKET_ACCESS_KEY =
  process.env.S3_BUCKET_ACCESS_KEY ?? "AKIA55IGFKLCGNSIHZWT";
const S3_BUCKET_SECRET_ACCESS_KEY_FILE =
  process.env.S33_BUCKET_SECRET_ACCESS_KEY_FILE ??
  "/run/secrets/s3-bucket-secret-access-key";
const S3_BUCKET_SECRET_ACCESS_KEY = fs.readFileSync(
  S3_BUCKET_SECRET_ACCESS_KEY_FILE,
  "utf-8"
);

const s3 = new S3Client({
  credentials: {
    accessKeyId: S3_BUCKET_ACCESS_KEY,
    secretAccessKey: S3_BUCKET_SECRET_ACCESS_KEY,
  },
  region: S3_BUCKET_REGION,
});

const s3BucketName = S3_BUCKET_NAME;

const s3ContentType = "image/png";

export { s3, s3BucketName, s3ContentType };

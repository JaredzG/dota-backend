import { S3Client } from "@aws-sdk/client-s3";
import "dotenv/config";

const BUCKET_NAME = process.env.S3_BUCKET_NAME;
const BUCKET_REGION = process.env.S3_BUCKET_REGION;
const ACCESS_KEY = process.env.USER_ACCESS_KEY ?? "";
const SECRET_ACCESS_KEY = process.env.USER_SECRET_ACCESS_KEY ?? "";

const s3 = new S3Client({
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
  region: BUCKET_REGION,
});

const s3BucketName = BUCKET_NAME;

const s3ContentType = "image/png";

export { s3, s3BucketName, s3ContentType };

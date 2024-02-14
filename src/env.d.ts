declare global {
  namespace NodeJS {
    interface ProcessEnv {
      S3_BUCKET_NAME: string;
      S3_BUCKET_REGION: string;
      USER_ACCESS_KEY: string;
      USER_SECRET_ACCESS_KEY: string;
      DB_URI: string;
    }
  }
}

export {};

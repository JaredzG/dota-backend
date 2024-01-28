import * as fs from "fs";
import path from "path";
import { PutObjectCommand } from "@aws-sdk/client-s3";

const uploadItemImages = async (
  s3: any,
  s3BucketName: any,
  s3ContentType: any
): Promise<void> => {
  const itemImages = fs.readdirSync("images/items");

  for (let i = 0; i < itemImages.length; i++) {
    const uploadheroAbilityImageCommand = new PutObjectCommand({
      Bucket: s3BucketName,
      Key: itemImages[i],
      Body: fs.readFileSync(path.join("images/heroes", itemImages[i])),
      ContentType: s3ContentType,
    });

    await s3.send(uploadheroAbilityImageCommand);
  }
};

export default uploadItemImages;

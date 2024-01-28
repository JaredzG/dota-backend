import * as fs from "fs";
import path from "path";
import { PutObjectCommand } from "@aws-sdk/client-s3";

const uploadHeroAbilityImages = async (
  s3: any,
  s3BucketName: any,
  s3ContentType: any
): Promise<void> => {
  const heroAbilityImages = fs.readdirSync("images/abilities");

  for (let i = 0; i < heroAbilityImages.length; i++) {
    const uploadheroAbilityImageCommand = new PutObjectCommand({
      Bucket: s3BucketName,
      Key: heroAbilityImages[i],
      Body: fs.readFileSync(path.join("images/heroes", heroAbilityImages[i])),
      ContentType: s3ContentType,
    });

    await s3.send(uploadheroAbilityImageCommand);
  }
};

export default uploadHeroAbilityImages;

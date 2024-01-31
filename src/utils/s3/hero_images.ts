import * as fs from "fs";
import path from "path";
import { PutObjectCommand } from "@aws-sdk/client-s3";

const heroPrimaryImages = fs.readdirSync("images/heroes");
const heroSecondaryImages = fs.readdirSync("images/heroes2");

const uploadHeroImages = async (
  s3: any,
  s3BucketName: any,
  s3ContentType: any
): Promise<void> => {
  for (let i = 0; i < heroPrimaryImages.length; i++) {
    const uploadHeroPrimaryImageCommand = new PutObjectCommand({
      Bucket: s3BucketName,
      Key: heroPrimaryImages[i],
      Body: fs.readFileSync(path.join("images/heroes", heroPrimaryImages[i])),
      ContentType: s3ContentType,
    });

    const uploadHeroSecondaryImageCommand = new PutObjectCommand({
      Bucket: s3BucketName,
      Key: heroSecondaryImages[i].replace(".png", "_2.png"),
      Body: fs.readFileSync(
        path.join("images/heroes2", heroSecondaryImages[i])
      ),
      ContentType: s3ContentType,
    });

    await s3.send(uploadHeroPrimaryImageCommand);

    await s3.send(uploadHeroSecondaryImageCommand);
  }
};

const getHeroImages = async (name: string): Promise<string[]> => {
  const heroPrimaryImage = heroPrimaryImages.filter(
    (hero: string) =>
      name.toLowerCase().replaceAll(",", "").replaceAll(" ", "_") ===
      hero.replace(".png", "")
  )[0];

  const heroSecondaryImage = heroSecondaryImages.filter(
    (hero: string) =>
      name.toLowerCase().replaceAll(",", "").replaceAll(" ", "_") ===
      hero.replace(".png", "")
  )[0];

  return [heroPrimaryImage, heroSecondaryImage];
};

export { uploadHeroImages, getHeroImages };

/* eslint-disable @typescript-eslint/no-unsafe-argument */
import * as fs from "fs";
import path from "path";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const heroPrimaryImages = fs.readdirSync("images/heroes");
const heroSecondaryImages = fs.readdirSync("images/heroes2");

const uploadHeroImages = async (
  s3: any,
  s3BucketName: any,
  s3ContentType: any
): Promise<void> => {
  console.log("------------- UPLOADING HERO IMAGES -------------");

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

    console.log("------------------------------------------");
    console.log(
      `#${i + 1} -- ${heroPrimaryImages[i]} || ${heroSecondaryImages[i].replace(
        ".png",
        "_2.png"
      )}`
    );
    console.log("------------------------------------------");
  }
};

const readAllHeroImageUrls = async (
  s3: any,
  s3BucketName: any
): Promise<void> => {
  console.log("------------- PRINTING HERO IMAGES -------------");

  for (let i = 0; i < heroPrimaryImages.length; i++) {
    const getHeroPrimaryImageCommand = new GetObjectCommand({
      Bucket: s3BucketName,
      Key: heroPrimaryImages[i],
    });

    const primaryImageUrl = await getSignedUrl(s3, getHeroPrimaryImageCommand);

    const getHeroSecondaryImageCommand = new GetObjectCommand({
      Bucket: s3BucketName,
      Key: heroPrimaryImages[i],
    });

    const secondaryImageUrl = await getSignedUrl(
      s3,
      getHeroSecondaryImageCommand
    );

    console.log("------------------------------------------");
    console.log(`#${i + 1} -- ${primaryImageUrl} || ${secondaryImageUrl}`);
    console.log("------------------------------------------");
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

export { uploadHeroImages, getHeroImages, readAllHeroImageUrls };

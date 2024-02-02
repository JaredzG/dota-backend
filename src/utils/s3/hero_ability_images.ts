/* eslint-disable @typescript-eslint/no-unsafe-argument */
import * as fs from "fs";
import path from "path";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const heroAbilityImages = fs.readdirSync("images/abilities");

const uploadHeroAbilityImages = async (
  s3: any,
  s3BucketName: any,
  s3ContentType: any
): Promise<void> => {
  console.log("------------- UPLOADING HERO ABILITY IMAGES -------------");

  for (let i = 0; i < heroAbilityImages.length; i++) {
    const uploadheroAbilityImageCommand = new PutObjectCommand({
      Bucket: s3BucketName,
      Key: heroAbilityImages[i],
      Body: fs.readFileSync(
        path.join("images/abilities", heroAbilityImages[i])
      ),
      ContentType: s3ContentType,
    });

    await s3.send(uploadheroAbilityImageCommand);

    console.log("------------------------------------------");
    console.log(`#${i + 1} -- ${heroAbilityImages[i]}`);
    console.log("------------------------------------------");
  }
};

const readAllHeroAbilityImageUrls = async (
  s3: any,
  s3BucketName: any
): Promise<void> => {
  console.log("------------- PRINTING HERO ABILITY IMAGES -------------");

  for (let i = 0; i < heroAbilityImages.length; i++) {
    const getHeroAbilityImageCommand = new GetObjectCommand({
      Bucket: s3BucketName,
      Key: heroAbilityImages[i],
    });

    const imageUrl = await getSignedUrl(s3, getHeroAbilityImageCommand);

    console.log("------------------------------------------");
    console.log(`#${i + 1} -- ${imageUrl}`);
    console.log("------------------------------------------");
  }
};

const getHeroAbilityImage = async (
  heroName: string,
  name: string
): Promise<string> => {
  const heroAbilityImage = heroAbilityImages.filter(
    (ability: string) =>
      `${heroName.toLowerCase().replaceAll(",", "").replaceAll(" ", "_")}_${name
        .toLowerCase()
        .replaceAll(",", "")
        .replaceAll(" ", "_")}` === ability.replace(".png", "")
  )[0];

  return heroAbilityImage;
};

export {
  uploadHeroAbilityImages,
  getHeroAbilityImage,
  readAllHeroAbilityImageUrls,
};

import * as fs from "fs";
import path from "path";
import { PutObjectCommand, type S3Client } from "@aws-sdk/client-s3";

const heroAbilityImages = fs.readdirSync("images/abilities");

const uploadHeroAbilityImages = async (
  s3: S3Client,
  s3BucketName: string,
  s3ContentType: string
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

export { uploadHeroAbilityImages, getHeroAbilityImage };

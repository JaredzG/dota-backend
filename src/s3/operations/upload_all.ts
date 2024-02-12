import { s3, s3BucketName, s3ContentType } from "../s3";
import { uploadHeroImages } from "../../lib/s3/hero_images";
import { uploadHeroAbilityImages } from "../../lib/s3/hero_ability_images";
import { uploadItemImages } from "../../lib/s3/item_images";

await uploadHeroImages(s3, s3BucketName, s3ContentType);
await uploadHeroAbilityImages(s3, s3BucketName, s3ContentType);
await uploadItemImages(s3, s3BucketName, s3ContentType);

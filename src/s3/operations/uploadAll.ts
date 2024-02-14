import { s3, s3BucketName, s3ContentType } from "../s3";
import { uploadHeroImages } from "../../lib/s3/heroImages";
import { uploadHeroAbilityImages } from "../../lib/s3/heroAbilityImages";
import { uploadItemImages } from "../../lib/s3/itemImages";

await uploadHeroImages(s3, s3BucketName, s3ContentType);
await uploadHeroAbilityImages(s3, s3BucketName, s3ContentType);
await uploadItemImages(s3, s3BucketName, s3ContentType);

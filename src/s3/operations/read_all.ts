import { s3, s3BucketName } from "../s3";
import { readAllHeroImageUrls } from "../../utils/s3/hero_images";
import { readAllHeroAbilityImageUrls } from "../../utils/s3/hero_ability_images";
import { readAllItemImageUrls } from "../../utils/s3/item_images";

await readAllHeroImageUrls(s3, s3BucketName);
await readAllHeroAbilityImageUrls(s3, s3BucketName);
await readAllItemImageUrls(s3, s3BucketName);

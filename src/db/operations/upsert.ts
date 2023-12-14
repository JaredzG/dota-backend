import * as fs from "fs";

const heroesFilePath = "/data/heroes.json";
const itemsFilePath = "/data/items.json";

fs.readFile(heroesFilePath, "utf-8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(data);
});

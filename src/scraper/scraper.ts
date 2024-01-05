import { spawnSync } from "child_process";

const args = process.argv.slice(2);
const spiderOutput: {
  hero: string;
  item: string;
  "hero-meta": string;
  "item-meta": string;
  [key: string]: string;
} = {
  hero: "heroes",
  item: "items",
  "hero-meta": "heroes.meta",
  "item-meta": "items.meta",
};

spawnSync(
  "python",
  ["-m", "pip", "install", "-r", "src/scraper/requirements.txt"],
  { encoding: "utf-8" }
);
for (const spider of args) {
  spawnSync(
    `scrapy`,
    ["crawl", spider, "-O", `../../../data/${spiderOutput[spider]}.json`],
    {
      cwd: "src/scraper/scraper",
      encoding: "utf-8",
      maxBuffer: 1024 * 2048,
    }
  );
}
spawnSync(
  "python",
  ["-m", "pip", "uninstall", "-r", "src/scraper/requirements.txt", "-y"],
  { encoding: "utf-8" }
);
spawnSync(
  "python",
  [
    "-m",
    "pip",
    "freeze",
    "|",
    "grep",
    "-v",
    "^pip==",
    "|",
    "xargs",
    "pip",
    "uninstall",
    "-y",
  ],
  { encoding: "utf-8" }
);

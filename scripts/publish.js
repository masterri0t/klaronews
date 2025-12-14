import fs from "fs";

const pool = JSON.parse(fs.readFileSync("data/pool.json"));
const published = JSON.parse(fs.readFileSync("data/published.json"));

const used = new Set(published.items.map(a => a.id));
const next = pool.items.find(a => !used.has(a.id));

if (!next) {
  console.log("No articles left");
  process.exit(0);
}

published.items.unshift({
  ...next,
  publishedAt: new Date().toISOString()
});

published.items = published.items.slice(0, 200);

fs.writeFileSync(
  "data/published.json",
  JSON.stringify(published, null, 2)
);

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, "../data/clean-data/clean-seed-data-total-yield-ingredients-edited-nullified.json");

const raw = JSON.parse(fs.readFileSync(inputPath, "utf8"));

const seen = new Set();
const deduped = [];

for (const recipe of raw) {
  const key = recipe.url?.trim() || recipe.name?.trim();

  if (!key) {
    console.warn("Warning: recipe missing URL & name:", recipe);
    continue;
  }

  if (!seen.has(key)) {
    seen.add(key);
    deduped.push(recipe);
  }
}

console.log(`Total recipes in input:  ${raw.length}`);
console.log(`Unique recipes output:   ${deduped.length}`);
console.log(`Removed duplicates:       ${raw.length - deduped.length}`);

const outputPath = path.join(__dirname, "../data/clean-data/clean-seed-data-total-yield-ingredients-edited-nullified-deduped.json");
fs.writeFileSync(outputPath, JSON.stringify(deduped, null, 2), "utf8");

console.log(`✔ Deduplicated file written to: ${outputPath}`);
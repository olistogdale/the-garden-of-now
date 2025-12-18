import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, "../data/clean-data/clean-seed-data-total-yield-ingredients-edited.json");

const raw = JSON.parse(fs.readFileSync(inputPath, "utf8"));

let output = raw.filter((recipe) => {
  if (recipe !== null) {
    return recipe;
  }
})

console.log(`Total recipes in input:  ${raw.length}`);
console.log(`Non-null recipes output:   ${output.length}`);
console.log(`Removed null entries:       ${raw.length - output.length}`);

const outputPath = path.join(__dirname, "../data/clean-data/clean-seed-data-total-yield-ingredients-edited-nullified.json");
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), "utf8");

console.log(`✔ Denullified file written to: ${outputPath}`);
'use strict';

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, '../../seed-data/clean-data/clean-seed-data-total.json');
const recipes = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

const abbrevUnits = '(?:cm|mg|g|kg|ml|cl|l)';
const units = '(?:millilit(?:er|re)s?|centilit(?:er|re)s?|lit(?:er|re)s?|milligram(?:me)?s?|gram(?:me)?s?|kilogram(?:me)?s?|tablespoons?|teaspoons?|tbsps?|tsps?|mugs?|cups?|shots?|pots?|bowls?|plates?|slices?|pieces?|squares?|bars?|burgers?|cakes?|tarts?|puddings?|biscuits?|cookies?|rolls?|skewers?|kebabs?|portions?|meals?|batch(?:es)?|loa(?:f|ves)|glass(?:es)?)|(?:jam )?jars?';
const imperialUnits = '(?:oz|lbs?|fl oz|pints?)'
const modifiers = '(?:large|small|medium|big|little|thick|thin|generous|normal|standard)';
const quantityRegExp = new RegExp( // Add onto the end of the line below (18) an additional capture [ (?<secondUnit>${units})? ]that captures the use of a second 'unit' - e.g. in this string "makes 2 x 1.2 litre puddings, each pudding serves 6"
  String.raw`\b(?<amount>\d+(?:\s*(?:-|\.|x|×)\s*\d+(.\d+)?)?)(?:(?<abbrev>${abbrevUnits})(?:/\d+(.\d+)?(?<imperial>${imperialUnits}))*\s*(?<unit>${units})?|(?:\s+(?<modifier>${modifiers}))?\s+(?<unit>${units}))?`, 
  'i'
);
const familyRegExp = new RegExp(
  String.raw`\b\d\s+(?:adults?|child(?:ren)?|kids?)`,
  'ig'
);


for (let recipe of recipes) {
  if (!recipe.yield) {
    continue;
  }
  if (typeof recipe.yield === 'number') {
    console.log('Serves ' + recipe.yield);
    continue;
  } else if (typeof recipe.yield === 'string') {
    let string = recipe.yield.toLowerCase();
    let action;


    // The logic below can be replaced with a .match for instances of 'serve' and 'make', which then returns the first instance, which relates to the relevant quantity figure extracted
    if (string.includes('serves')) {
      action = 'Serves'
    } else {
      action = 'Makes'
    }
    

    if (string.includes('adult') && (string.includes('child') || string.includes('kid'))) {
      if (!(string.includes(' or ') || string.includes('(or ') || string.includes('makes'))) {
        const familyMatches = [...string.matchAll(familyRegExp)];
        if (familyMatches) {
          console.log(string);
          console.log(familyMatches);
        }
      }
    } else {
      const quantityMatch = string.match(quantityRegExp);
      if (quantityMatch) {
        const { amount, abbrev, modifier, unit } = quantityMatch.groups ?? {};
        let newQuantity = amount;
        // Add into the logic in the following 5 lines a further clause which includes a second unit on the end of the newQuantity string in the event that the initial string contains one e.g. for this string - "makes 2 x 1.2 litre puddings, each pudding serves 6"
        if (abbrev) {
          newQuantity = unit ? `${amount}${abbrev} ${unit}` : `${amount}${abbrev}`;
        } else if (unit) {
          newQuantity = modifier? `${amount} ${modifier} ${unit}` : `${amount} ${unit}`;
        }
        console.log(string, `${action} ${newQuantity}`);
      } else {
        console.log('NEEDS CONSIDERATION - ' + string);
      }
    }
  }
}

// const outputPath = path.join(__dirname, '../../seed-data/clean-data/clean-seed-data-total-edited.json');
// fs.writeFileSync(outputPath, JSON.stringify(recipes, null, 2), 'utf8')
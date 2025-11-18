'use strict';

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, '../../seed-data/clean-data/clean-seed-data-total.json');
const recipes = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

const abbrevUnits = '(?:cm|mg|g|kg|ml|cl|l)';
const units = '(?:millilit(?:er|re)s?|centilit(?:er|re)s?|lit(?:er|re)s?|milligram(?:me)?s?|gram(?:me)?s?|kilogram(?:me)?s?|tablespoons?|teaspoons?|tbsps?|tsps?|mugs?|cups?|shots?|pots?|bowls?|plates?|slices?|pieces?|squares?|bars?|burgers?|cakes?|tarts?|biscuits?|rolls?|skewers?|kebabs?|portions?|loa(?:f|ves)|glass(?:es)?)|(?:jam )?jars?';
const imperialUnits = '(?:oz|lbs?|fl oz|pints?)'
const modifiers = '(?:large|small|medium|big|little|thick|thin|generous|normal|standard)';
const quantityRegExp = new RegExp(
  String.raw`\b(?<amount>\d+(?:\s*(?:-|\.|x|×)\s*\d+)?)(?:(?<abbrev>${abbrevUnits})(?:/\d+(.\d+)?(?<imperial>${imperialUnits}))*\s*(?<unit>${units})?|(?:\s+(?<modifier>${modifiers}))?\s+(?<unit>${units}))?`,
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
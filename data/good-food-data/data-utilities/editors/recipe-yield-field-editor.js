'use strict';

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, '../../seed-data/clean-data/clean-seed-data-total.json');
const recipes = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

const metricUnits = '(?:centimet(?:er|re)s?|millilit(?:er|re)s?|centilit(?:er|re)s?|lit(?:er|re)s?|milligram(?:me)?s?|gram(?:me)?s?|kilogram(?:me)?s?)';
const metricUnitsAbbrev = '(?:cm|mg|g|kg|ml|cl|l)';
const imperialUnits = '(?:oz|lbs?|fl oz|pints?|gallons?)';
const modifiers = '(?:large|small|medium|big|little|thick|thin|generous|normal|standard)';
const quantities = '(tablespoons?|teaspoons?|tbsps?|tsps?|mugs?|cups?|bottles?|shots?|pots?|bowls?|plates?|bags?|slices?|pieces?|slabs?|sheets?|squares?|cakes?|tarts?|puddings?|biscuits?|cookies?|rolls?|portions?|meals?|batch(?:es)?|loa(?:f|ves)|glass(?:es)?|(?:jam )?jars?)';

const actionRegExp = new RegExp(
  String.raw`\b(?:serves?|makes?)\b`,
  'i'
)

const familyRegExp = new RegExp(
  String.raw`\b(\d)\s+(adults?|child(?:ren)?|kids?)`,
  'ig'
);

const quantityRegExp = new RegExp(
  String.raw`\b(?<amount>\d+(?:\s*(?:-|\.|x|×)\s*\d+(?:\.\d+)?)?)(?:((?:\s*(?<metric>${metricUnits})\b)|(?:\s*(?<metricAbbrev>${metricUnitsAbbrev})\b))?(?:/\s*(?:\d+(?:\.\d+)?\s*(?<imperial>${imperialUnits}))+\b)?(?:\s*(?<modifier>${modifiers})\b)?(?:\s*(?<quantity>${quantities})\b)?)?`,
  'i'
);

for (let recipe of recipes) {
  if (!recipe.yield) {
    continue;
  }
  if (typeof recipe.yield === 'number') {
    recipe.yield = 'Serves ' + recipe.yield
  } else if (typeof recipe.yield === 'string') {
    let string = recipe.yield.toLowerCase();
    let action;
    const actionMatch = string.match(actionRegExp);

    if (actionMatch) {
      action = actionMatch[0];
      action = action[0].toUpperCase() + action.slice(1);
    } else {
      action = 'Makes';
    }

    if (string.includes('adult') && (string.includes('child') || string.includes('kid'))) {
      if (!(string.includes(' or ') || string.includes('(or ') || string.includes('makes'))) {
        const familyMatches = [...string.matchAll(familyRegExp)];
        if (familyMatches) {
          let servings = 0;
          for (let el of familyMatches) {
            if (el[2].includes('adult')) {
              servings += Number(el[1]);
            } else {
              servings += Math.floor(Number(el[1])/2);
            }
          }
          console.log(recipe.name, recipe.yield, 'Serves ' + servings);
          recipe.yield = 'Serves ' + servings;
        }
      }
    } else {
      const quantityMatch = string.match(quantityRegExp);
      if (quantityMatch) {
        const { amount, metric, metricAbbrev, modifier, quantity } = quantityMatch.groups ?? {};
        let newQuantity = amount;
        if (metric || metricAbbrev) {
          newQuantity = metricAbbrev ? newQuantity + `${metricAbbrev}` : newQuantity + ` ${metric}`;
          if (quantity) {
            newQuantity = newQuantity + ` ${quantity}`;
          }
        } else if (quantity) {
          newQuantity = modifier? newQuantity + ` ${modifier} ${quantity}` : newQuantity + ` ${quantity}`;
        }

        console.log(recipe.name, recipe.yield, `${action} ${newQuantity}`);
        recipe.yield = `${action} ${newQuantity}`;
      } else {
        console.log(recipe.name, recipe.yield, `TO BE DELETED`);
        delete recipe.yield;
      }
    }
  }
}

const outputPath = path.join(__dirname, '../../seed-data/clean-data/clean-seed-data-total-yield-edited.json');
fs.writeFileSync(outputPath, JSON.stringify(recipes, null, 2), 'utf8')
'use strict';

import fs from 'node:fs';
import path from 'node:path';
import { decode } from 'html-entities';
import pluralize from 'pluralize';

import recipes from '../../seed-data/clean-data/clean-seed-data-total-yield-edited.json' with { type: 'json' };
import seasonalIngredients from '../../../ingredients-data/seed-data/clean-data/seasonal-ingredients.json' with { type: 'json'};
import seasonalIngredientProducts from '../../../ingredients-data/seed-data/clean-data/seasonal-ingredient-products-nested.json' with { type: "json"};
import seasonalIngredientFallbacks from '../../../ingredients-data/seed-data/clean-data/seasonal-ingredient-fallbacks.json' with { type: "json"};
import nonSeasonalIngredients from '../../../ingredients-data/seed-data/clean-data/non-seasonal-ingredients.json' with { type: "json"};

let seasonalIngredientNames = [];

for (let foodGroup of Object.values(seasonalIngredients)) {
  for (let ingredient of foodGroup) {
    seasonalIngredientNames.push(ingredient.name);
    ingredient.altnames?.forEach(name => seasonalIngredientNames.push(name));
  }
}

let seasonalIngredientProductNames = [];

for (let foodGroup of Object.values(seasonalIngredientProducts)) {
  for (let ingredient of Object.values(foodGroup)) {
    for (let product of ingredient) {
      seasonalIngredientProductNames.push(product.name);
      product.altnames?.forEach(name => seasonalIngredientProductNames.push(name));
    }
  }
}

let seasonalIngredientFallbackNames = [];

for (let ingredient of seasonalIngredientFallbacks) {
  seasonalIngredientFallbackNames.push(ingredient.name);
  ingredient.altnames?.forEach(name => seasonalIngredientFallbackNames.push(name));
}

let nonSeasonalIngredientNames = [];

for (let foodGroup of Object.values(nonSeasonalIngredients)) {
  for (let ingredient of foodGroup) {
    nonSeasonalIngredientNames.push(ingredient.name);
    ingredient.altnames?.forEach(name => nonSeasonalIngredientNames.push(name));
  }
}

let totalIngredientNames = [...seasonalIngredientNames, ...seasonalIngredientProductNames, ...seasonalIngredientFallbackNames, ...nonSeasonalIngredientNames]

let totalIngredientNamesInitialToken = new Set()

for (let ingredientName of totalIngredientNames) {
  const tokens = ingredientName.split(' ');
  if (!totalIngredientNamesInitialToken.has(tokens[0])) {
    totalIngredientNamesInitialToken.add(tokens[0])
  }
}

let totalIngredientNamesFinalToken = new Set()

for (let ingredientName of totalIngredientNames) {
  const tokens = ingredientName.split(' ');
  if (!totalIngredientNamesFinalToken.has(tokens[tokens.length-1])) {
    totalIngredientNamesFinalToken.add(tokens[tokens.length-1])
  }
}

totalIngredientNamesInitialToken = [...totalIngredientNamesInitialToken].sort((a,b) => b.length - a.length)
totalIngredientNamesFinalToken = [...totalIngredientNamesFinalToken].sort((a,b) => b.length - a.length)

pluralize.addIrregularRule('chilli', 'chillies')

const metricUnits = '(?:centimet(?:er|re)s?|millilit(?:er|re)s?|centilit(?:er|re)s?|lit(?:er|re)s?|milligram(?:me)?s?|gram(?:me)?s?|kilogram(?:me)?s?)';
const metricUnitsAbbrev = '(?:cm|mg|g|kg|ml|cl|l)';
const imperialUnits = '(?:oz|lbs?|fl oz|pints?|gallons?)';
const modifiers = '(?:large|small|medium|medium-sized?|big|little|thick|thin|slim|generous|normal|standard|heaped|flat|thumb-sized?)';
const quantities = '(tablespoons?|teaspoons?|tbsps?|tsps?|mugs?|cups?|bottles?|cans?|packs?|shots?|pots?|bowls?|bags?|slices?|pieces?|cubes?|slabs?|sheets?|squares?|rolls?|portions?|handfuls?|fistfuls?|fists?|pinch(?:es)?|fingers?|bulbs?|heads?|stalks?|sprigs?|branch(?:es)?|pouch(?:es)?|loa(?:f|ves)|lea(?:f|ves)|glass(?:es)?|knobs?|bunch(?:es)?|(?:jam )?jars?)';

const indefiniteArticles = '(?:a|an|some|a few|a couple of)';
const nonNumericQuantity = `(?:${indefiniteArticles}\\s+(?:${quantities}))`;

// const quantityRegExp = new RegExp(
//   String.raw`\b(?:\d+(?:\s*(?:-|\.|x|×)\s*\d+(?:\.\d+)?)?)(?:((?:\s*(?:${metricUnits})\b)|(?:\s*(?:${metricUnitsAbbrev})\b))?(?:/\s*(?:\d+(?:\.\d+)?\s*(?:${imperialUnits}))+\b)?(?:\s*(?:${modifiers})\b)?(?:\s*(?:${quantities})\b)?)?`,
//   'i'
// );

const quantityRegExp = new RegExp(
  String.raw`\b(?:\d+(?:\s*(?:-|\.|x|×)\s*\d+(?:\.\d+)?)?|${nonNumericQuantity})` +
  String.raw`(?:((?:\s*(?:${metricUnits})\b)|(?:\s*(?:${metricUnitsAbbrev})\b))?` +
  String.raw`(?:/\s*(?:\d+(?:\.\d+)?\s*(?:${imperialUnits}))+\b)?` +
  String.raw`(?:\s*(?:${modifiers})\b)?` +
  String.raw`(?:\s*(?:${quantities})\b)?)?`,
  'i'
);

const optionalRegExp = new RegExp(
  String.raw`(?:optional|to serve)`,
  'i'
)

const leadingArticleBeforeNumber = new RegExp(
  `^${indefiniteArticles}\\s+(?=\\d)`,
  'i'
);

function makeIngredientRegExp(name) {
  return new RegExp(
    String.raw`(^|[^a-z])${name}([^a-z]|$)`,
    "i"
  );
}

function cleanIngredientLine(string, boolean) {
  let text = decode(string.toLowerCase());
  if (boolean) {
  return text
    .replace(/\s+/g, " ")
    .trim();
  } else {
  return text
    .replace(/\([^)]*\)/gu, "")
    .replace(/\s+/g, " ")
    .trim();
  }
}

function splitIngredientOptions(string) {
  const substrings = string.split(/\s+or\s+/i).map(substring => substring.trim());

  const quantityStartRegExp = new RegExp(
    String.raw`^(?:(?:${indefiniteArticles}\s+)?\d+(?:[.,]\d+)?(?:\s*[x×-]\s*\d+(?:[.,]\d+)?)?|${nonNumericQuantity})`,
    'i'
  );

  const groupedSubstrings = [];
  let current = null;

  for (let substring of substrings) {
    
    substring = substring.replace(
      leadingArticleBeforeNumber,
      ''
    ).trim();
    
    const startsWithQuantity = quantityStartRegExp.test(substring);

    if (startsWithQuantity) {
      if (current) groupedSubstrings.push(current);
      current = substring;
    } else {
      if (current) {
        current += " or " + substring;
      } else {
        current = substring;
      }
    }
  }

  if (current) groupedSubstrings.push(current);

  return groupedSubstrings;
}

function groupString(string) {
  let initialBoundary = Infinity;
  let initialToken;
  let finalBoundary = 0;
  let finalToken;

  for (let token of totalIngredientNamesFinalToken) {
    let tokenPlural = pluralize(token)
    let indexPlural = findFinalIndex(string, tokenPlural)
    let index = findFinalIndex(string, token);
    if (indexPlural !== -1 && indexPlural > finalBoundary) {
      finalBoundary = indexPlural;
      finalToken = tokenPlural;
    } else if (index !== -1 && index > finalBoundary) {
      finalBoundary = index;
      finalToken = token;
    }
  }

  let headAndBody = string.slice(0, finalBoundary);
  let tail = string.slice(finalBoundary);

  for (let token of totalIngredientNamesInitialToken) {        
    let tokenPlural = pluralize(token);
    let indexPlural = findInitialIndex(headAndBody, tokenPlural);
    let index = findInitialIndex(headAndBody, token);
    if (indexPlural !== -1 && indexPlural < initialBoundary) {
      initialBoundary = indexPlural;
      initialToken = tokenPlural;
    } else if (index !== -1 && index < initialBoundary) {
      initialBoundary = index;
      initialToken = token;
    }
  }

  let head = headAndBody.slice(0, initialBoundary);
  let body = headAndBody.slice(initialBoundary);

  return {head, tail, body, initialBoundary, finalBoundary}
}

function findInitialIndex(text, token) {
  let index = text.indexOf(token);
  if (index === -1) return -1;

  const boundaryBefore = index === 0 || !/([a-z]|-)/i.test(text[index - 1])
  const boundaryAfter = index + token.length === text.length || !/([a-z]|-)/i.test(text[index + token.length])

  return boundaryBefore && boundaryAfter ? index : -1;
}

function findFinalIndex(text, token) {
  let index = text.lastIndexOf(token);
  if (index === -1) return -1;

  const boundaryBefore = index === 0 || !/([a-z]|-)/i.test(text[index - 1])
  const boundaryAfter = index + token.length === text.length || !/([a-z]|-)/i.test(text[index + token.length])

  return boundaryBefore && boundaryAfter ? index + token.length : -1;
}

function extractQuantity(head, tail) {
  let description = head.replace(" of ", " ").replace(" a ", " ");
  let preparation = tail;
  let quantityMatch = description.match(quantityRegExp);
  if (quantityMatch) {
    let quantity = quantityMatch[0];
    let index = quantityMatch.index + quantity.length;
    description = description.slice(index).trim();
    return {
      quantity,
      description,
      preparation: preparation.trim()
    };
  } else {
    return {
      quantity: null,
      description: description.trim(),
      preparation: preparation.trim()
    };
  }
}

// for (let recipe of recipes) {

// }

for (let el = 0; el < 9; el++) {
  let remove = false;
  for (let ingredientLine of recipes[el].ingredients) {
    if (optionalRegExp.test(ingredientLine) && !ingredientLine.includes('plus')) {
      ingredientLine = {
        text: cleanIngredientLine(ingredientLine, true),
        optional: true
      }
      console.log(ingredientLine);
    } else {
      let text = cleanIngredientLine(ingredientLine, false)
      let ingredientOptions = splitIngredientOptions(text);
      ingredientLine = {
        text: cleanIngredientLine(ingredientLine, false),
        optional: false,
        ingredientOptions: []
      }
      for (let ingredientOption of ingredientOptions) {
        const {head, body, tail, initialBoundary, finalBoundary} = groupString(ingredientOption)
        if (initialBoundary === Infinity || finalBoundary === 0) {
          remove = true;
        } else {
          let {quantity, description, preparation} = extractQuantity(head, tail);

          let rawIngredients = body;
          ingredientLine.ingredientOptions.push({
            quantity,
            description,
            rawIngredients,
            preparation
          })
        }
      }
      console.log(ingredientLine)
    }
  }
  if (remove === true) {
    console.log('--- INVALID RECIPE ---')
  } else {
    console.log('--- RECIPE ENDS ---')
  }
}



// const outputPath = path.join(__dirname, '../../seed-data/clean-data/clean-seed-data-total-yield-ingredients-edited.json');
// fs.writeFileSync(outputPath, JSON.stringify(recipes, null, 2), 'utf8')


// type recipeImage = {
//   url: string,
//   width: number,
//   height: number
// }

// type recipeNutrition = {
//   calories: string,
//   fatContent: string,
//   saturatedFatContent: string,
//   carbohydrateContent: string,
//   sugarContent: string,
//   fiberContent: string,
//   proteinContent: string,
//   sodiumContent: string
// }

// type recipeInstruction = {
//   text: string
// }

// type recipeInput = {
//   name: string,
//   description: string,
//   image: recipeImage[],
//   url: string,
//   keywords: string,
//   prepTime?: string,
//   cookTime?: string,
//   totalTime?: string,
//   nutrition: recipeNutrition,
//   cuisine?: string,
//   skillLevel?: string,
//   yield?: string,
//   catgory?: string,
//   ingredients: string[],
//   instructions: recipeInstruction[]
// }

// type recipeIngredient = {
//   text: string,
//   quantity: string,
//   unit?: string
//   ingredient:
// }

// type recipeOutput = {
//   name: string,
//   description: string,
//   image: recipeImage[],
//   url: string,
//   keywords: string,
//   prepTime?: string,
//   cookTime?: string,
//   totalTime?: string,
//   nutrition: recipeNutrition,
//   cuisine?: string,
//   skillLevel?: string,
//   yield?: string,
//   catgory?: string,
//   ingredients: recipeIngredient[],
//   instructions: recipeInstruction[]
// }

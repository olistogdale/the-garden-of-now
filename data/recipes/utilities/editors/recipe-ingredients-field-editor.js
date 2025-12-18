'use strict';

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { decode } from 'html-entities';
import pluralize from 'pluralize';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import recipes from '../../data/clean-data/clean-seed-data-total-yield-edited.json' with { type: 'json' };
import seasonalIngredients from '../../../ingredients/data/clean-data/seasonal-ingredients.json' with { type: 'json'};
import seasonalIngredientProducts from '../../../ingredients/data/clean-data/seasonal-ingredient-products-nested.json' with { type: "json"};
import seasonalIngredientFallbacks from '../../../ingredients/data/clean-data/seasonal-ingredient-fallbacks.json' with { type: "json"};
import nonSeasonalIngredients from '../../../ingredients/data/clean-data/non-seasonal-ingredients.json' with { type: "json"};

let seasonalIngredientNames = [];

for (let foodGroup of Object.values(seasonalIngredients)) {
  for (let ingredient of foodGroup) {
    seasonalIngredientNames.push(ingredient.name);
    ingredient.altnames?.forEach(name => seasonalIngredientNames.push(name));
  }
}

let seasonalIngredientProductNames = [];
let seasonalIngredientProductLookup = {};

for (let foodGroup of Object.values(seasonalIngredientProducts)) {
  for (let [parentIngredient, productList] of Object.entries(foodGroup)) {
    for (let product of productList) {
      seasonalIngredientProductNames.push(product.name);
      seasonalIngredientProductLookup[product.name] = parentIngredient;
      product.altnames?.forEach(name => {
        seasonalIngredientProductNames.push(name);
        seasonalIngredientProductLookup[name] = parentIngredient;
      })
    }
  }
}

let seasonalIngredientFallbackNames = [];
let seasonalIngredientFallbackLookup = {}

for (let ingredient of seasonalIngredientFallbacks) {
  seasonalIngredientFallbackNames.push(ingredient.name);
  seasonalIngredientFallbackLookup[ingredient.name] = ingredient.parentIngredients;
  ingredient.altnames?.forEach(name => {
    seasonalIngredientFallbackNames.push(name);
    seasonalIngredientFallbackLookup[name] = ingredient.parentIngredients;
  });
}

let nonSeasonalIngredientNames = [];

for (let foodGroup of Object.values(nonSeasonalIngredients)) {
  for (let ingredient of foodGroup) {
    nonSeasonalIngredientNames.push(ingredient.name);
    ingredient.altnames?.forEach(name => nonSeasonalIngredientNames.push(name));
  }
}

const ingredientNames = [
  ...seasonalIngredientNames,
  ...seasonalIngredientProductNames,
  ...seasonalIngredientFallbackNames,
  ...nonSeasonalIngredientNames
].sort((a, b) => b.length - a.length);

let ingredientNameInitialTokens = new Set();
let ingredientNameFinalTokens   = new Set();

for (const name of ingredientNames) {
  const tokens = name.trim().split(/\s+/);
  ingredientNameInitialTokens.add(tokens[0]);
  ingredientNameFinalTokens.add(tokens[tokens.length - 1]);
}

ingredientNameInitialTokens = [...ingredientNameInitialTokens].sort((a, b) => b.length - a.length);
ingredientNameFinalTokens   = [...ingredientNameFinalTokens].sort((a, b) => b.length - a.length);

pluralize.addIrregularRule('chilli', 'chillies')

const numericQuantity = String.raw`(?:(?:\d+[\/⁄]\d+|\d+\s+\d+[\/⁄]\d+|\d+(?:\.\d+)?))`;
const articles = String.raw`(?:some|a few|few|a couple of|an|a)`
const qualifiers = String.raw`(?:about|around|roughly|half|half of|quarter|quarter of)`
const metricUnits = String.raw`(?:centimet(?:er|re)s?|millilit(?:er|re)s?|centilit(?:er|re)s?|lit(?:er|re)s?|milligram(?:me)?s?|gram(?:me)?s?|kilogram(?:me)?s?|cm|mg|g|kg|ml|cl|l)`
const imperialUnits = String.raw`(?:inch|in|oz|lbs?|fl oz|pts?|pints?|gallons?)`
const modifiers = String.raw`(?:(?:large|small|medium|medium-sized?|big|little|thick|thin|slim|generous|good|tiny|healthy|normal|standard|heaped|flat|thumb-sized?)(?!-))`
const quantities = String.raw`(?:tablespoons?|teaspoons?|tbsps?|tsps?|drops?|mugs?|cups?|bottles?|cans?|packs?|packets?|cartons?|tubs?|logs?|shots?|pots?|bowls?|bags?|slices?|rashers?|strips?|sticks?|pieces?|cubes?|slabs?|sheets?|squeezes?|squares?|balls?|rolls?|portions?|handfuls?|fistfuls?|fists?|dash(?:es)?|pinch(?:es)?|fingers?|bulbs?|heads?|stalks?|sprigs?|branch(?:es)?|splash(?:es)?|pouch(?:es)?|loa(?:f|ves)|lea(?:f|ves)|glass(?:es)?|knobs?|bunch(?:es)?|(?:jam )?jars?)`;

const numericRange = String.raw`(?:${numericQuantity}(?:\s*-\s*${numericQuantity})?)`

const quantityRegExp = new RegExp(
  String.raw`(?:` +
  String.raw`(?:(?:(?:${qualifiers}\s*)?(?:${articles}\s*)?|(?:${numericRange}\s*)(?:(?:x|×)\s*)?)?(?:${numericRange}\s*)(?:(?:${metricUnits}|${imperialUnits})\s*)(?:[\/⁄]\s*(?:${numericRange}\s*)(?:${imperialUnits}\s*))?(?:${quantities}\s*)?)\b` +
  String.raw`|` +
  String.raw`(?:(?:${qualifiers}\s*)?(?:(?:${numericRange}|${articles})\s*)(?:${modifiers}\s*)?(?:${quantities}\s*)?)\b` +
  String.raw`|` +
  String.raw`(?:${articles}\s*|(?:(?:${modifiers}\s*)?${quantities}\s*)|${modifiers}\s*)\b` +
  String.raw`)`,
  'i'
)




const optionalRegExp = new RegExp(
  String.raw`(?:optional|to serve)`,
  'i'
)

const citrusFruits = ['clementine', 'easy peeler', 'grapefruit', 'lemon', 'lime', 'mandarin', 'orange', 'satsuma', 'tangerine']


function trimmer(string) {
  string = string.trim();
  return string.replace(/^[^a-z0-9]+|[^a-z0-9]+$/gi, '');
}


function cleanIngredientLine(string, boolean) {
  let text = decode(string.toLowerCase());
  
  const unicodeFractions = {
    '½': '1/2',
    '⅓': '1/3',
    '⅔': '2/3',
    '¼': '1/4',
    '¾': '3/4',
    '⅕': '1/5',
    '⅖': '2/5',
    '⅗': '3/5',
    '⅘': '4/5',
    '⅙': '1/6',
    '⅚': '5/6',
    '⅛': '1/8',
    '⅜': '3/8',
    '⅝': '5/8',
    '⅞': '7/8'
  };

  text = text.replace(
    /[½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]/g,
    m => unicodeFractions[m]
  );

  text = text.replace(
    /(\d)\s*(1\/2|1\/3|2\/3|1\/4|3\/4|1\/5|2\/5|3\/5|4\/5|1\/6|5\/6|1\/8|3\/8|5\/8|7\/8)/g,
    (_, whole, frac) => `${whole} ${frac}`
  );

  text = text.replace(/["“”‘’]/g, '');

  if (boolean) {
  return trimmer(text.replace(/\s+/g, " "))
  } else {
  return trimmer(text.replace(/\s+\([^)]*\)/gu, "").replace(/\s+/g, " "))
  }
}

function splitIngredientOptions(string) {
  const substrings = string.split(/\s+or\s+/i).map(substring => trimmer(substring));
  const groupedSubstrings = [];
  let current = null;

  for (let substring of substrings) {
    const quantityMatch = substring.match(quantityRegExp);
    const startsWithQuantity = quantityMatch && quantityMatch.index === 0;

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

function finalIndex(string, tokenArray) {
  let finalBoundary = 0;
  let finalToken;  
  let tokenPlural
  for (let token of tokenArray) {
    if (token.includes(' of ')) {
      const [tokenHead, tokenTail] = token.split(' of ');
      tokenPlural = pluralize(tokenHead) + ' of ' + tokenTail;
    } else {
      tokenPlural = pluralize(token)
    }
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
  return finalBoundary;
}

function initialIndex(string, tokenArray) {
  let initialBoundary = Infinity;
  let initialToken;
  for (let token of tokenArray) {
    let tokenPlural = pluralize(token)
    let indexPlural = findInitialIndex(string, tokenPlural)
    let index = findInitialIndex(string, token);
    if (indexPlural !== -1 && indexPlural < initialBoundary) {
      initialBoundary = indexPlural;
      initialToken = tokenPlural;
    } else if (index !== -1 && index < initialBoundary) {
      initialBoundary = index;
      initialToken = token;
    }
  }
  return initialBoundary;
}

function groupString(string) {

  let finalBoundary = finalIndex(string, ingredientNames)

  let headAndBody = string.slice(0, finalBoundary);
  let tail = trimmer(string.slice(finalBoundary));

  if (tail.startsWith('and/or') || tail.startsWith('and') || tail.startsWith('or')) {
    const newFinalBoundary = finalIndex(tail, ingredientNameFinalTokens);
    if (newFinalBoundary) {
      finalBoundary = newFinalBoundary
      headAndBody = headAndBody + ' ' + tail.slice(0, finalBoundary);
      tail = trimmer(tail.slice(finalBoundary));
    }
  }

  let initialBoundary = initialIndex(string, ingredientNames)

  let head = trimmer(headAndBody.slice(0, initialBoundary));
  let body = trimmer(headAndBody.slice(initialBoundary));

  if (head.endsWith("and/or") || head.endsWith("and") || head.endsWith("or")) {
    const newInitialBoundary = initialIndex(head, ingredientNameInitialTokens);
    if (newInitialBoundary) {
      initialBoundary = newInitialBoundary;
      body = head.slice(initialBoundary) + ' ' + body;
      head = head.slice(0, initialBoundary);
    }
  }

  return {head, tail, body, initialBoundary, finalBoundary}
}

function adaptForCitrus(head, body, tail) {
  if (citrusFruits.some((fruit) => {
    return body.includes(fruit) && (head.includes('zest') || head.includes('juice'));
  })) {
    const citrusQuantityMatch = head.match(quantityRegExp);
    let extraPreparation;
    if (citrusQuantityMatch) {
      extraPreparation = trimmer(head.slice(0, citrusQuantityMatch.index));
    } else {
      extraPreparation = head;
    }
    if (tail.startsWith('and') || tail.startsWith('or') || tail.startsWith('plus') || tail.length > 0) {
      return extraPreparation + ', ' + tail;
    } else {
      return extraPreparation;
    }
  } else {
    return tail;
  }
}

function extractQuantity(head, body, tail) {
  let description = trimmer(head.replace(/\bof\b/, ""));
  let preparation = adaptForCitrus(description, body, tail);
  let quantityMatch = description.match(quantityRegExp);

  if (quantityMatch) {
    let quantity = trimmer(quantityMatch[0]);
    let index = quantityMatch.index + quantity.length;
    description = trimmer(description.slice(index));
    return {
      quantity,
      description,
      preparation
    };
  } else {
    return {
      quantity: null,
      description,
      preparation
    };
  }
}

function listRecombinator(string) {
  const list = string
    .split(',')
    .flatMap(s => s.split(/\bor\b/))
    .map(t => t.trim());
  if (list.length === 1) {
    return [string];
  }
  const recombinedList = []
  let leadingToken;
  let trailingToken
  const leadingItemArr = list[0].split(' ').map(t => t.trim());
  if (leadingItemArr.length > 1) {
    leadingToken = leadingItemArr[0];
  } else {
    leadingToken = ''
  }
  const trailingItemArr = list[list.length - 1].split(' ').map(t => t.trim());
  if (trailingItemArr.length > 1) {
    trailingToken = trailingItemArr[trailingItemArr.length - 1]
  } else {
    trailingToken = ''
  }
  
  for (let i = 0; i < list.length; i++) {
    let ingredient;
    if (i === 0) {
      ingredient = list[i] + ' ' + trailingToken
    } else if (i === list.length - 1) {
      ingredient = leadingToken + ' ' + list[i]
    } else {
      ingredient = leadingToken + ' ' + list[i] + ' ' + trailingToken
    }
    recombinedList.push(ingredient);
  }
  return recombinedList
}

function extractRawIngredients(input) {
  let ingredients = []
  const prepMatch = input.match(/\b(of|in)\b/)
  if (prepMatch) {
    const prep = prepMatch[1];
    const [left, right] = input.split(new RegExp(String.raw`\b${prep}\b`)).map(s => s.trim());

    const leftClausesRecombined = listRecombinator(left).map(t => t.trim());
    const rightClausesRecombined = listRecombinator(right).map(t => t.trim());

    for (let leftSide of leftClausesRecombined) {
      for (let rightSide of rightClausesRecombined) {
        if (prep === 'of') {
          ingredients.push(`${leftSide} ${prep} ${rightSide}`)
        } else if (prep === 'in') {
          ingredients.push(`${leftSide}`)
        }
      }
    }
  } else {
    ingredients = listRecombinator(input).map(t => t.trim());
  }

  const rawIngredientsAndProducts = [];

  for (let ingredient of ingredients) {
    for (let ingredientName of ingredientNames) {
      const ingredientNamePlural = pluralize(ingredientName);
      const ingredientMatchPlural = ingredient.match(ingredientNamePlural);
      const ingredientMatch = ingredient.match(ingredientName);
      if (ingredientMatchPlural || ingredientMatch) {
        if (!rawIngredientsAndProducts.includes(ingredientName)) {
          rawIngredientsAndProducts.push(ingredientName);
        }
        break;
      }

    }
  }

  const rawIngredients = []

  for (let rawIngredientOrProduct of rawIngredientsAndProducts) {
    let masterIngredients;
    if (seasonalIngredientProductLookup[rawIngredientOrProduct]) {
      masterIngredients = [seasonalIngredientProductLookup[rawIngredientOrProduct]];
    } else if (seasonalIngredientFallbackLookup[rawIngredientOrProduct]) {
      masterIngredients = seasonalIngredientFallbackLookup[rawIngredientOrProduct]
    } else {
      masterIngredients = [rawIngredientOrProduct];
    }
    masterIngredients.forEach(ingredient => {
      if (!rawIngredients.includes(ingredient)) {
        rawIngredients.push(ingredient)
      }
    });
  }
  return rawIngredients;
}

const parsedRecipes = recipes.map((recipe) => {
  try {
    let parsedRecipeIngredients = recipe.ingredients.map((ingredientLine) => {
      if (optionalRegExp.test(ingredientLine) && !ingredientLine.includes('plus')) {
        let parsedIngredientObject = {
          text: cleanIngredientLine(ingredientLine, true),
          optional: true
        }
        return parsedIngredientObject
      } else {
        const text = cleanIngredientLine(ingredientLine, false);
        const ingredientOptions = splitIngredientOptions(text);
        
        const parsedIngredientOptions = ingredientOptions
          .map((option) => {
            const {head, body, tail, initialBoundary, finalBoundary} = groupString(option);
            if (initialBoundary === Infinity || finalBoundary === 0) {
              return null;
            }
            let {quantity, description, preparation} = extractQuantity(head, body, tail);
            let ingredient = body;
            let rawIngredients = extractRawIngredients(body);
            return {
              quantity,
              description,
              ingredient,
              rawIngredients,
              preparation
            };
          })
          .filter((option) => option !== null)
        
        if (parsedIngredientOptions.length === 0) {
          return null;
        } else {
          let parsedIngredientObject = {
            text,
            optional: false,
            ingredientOptions: parsedIngredientOptions
          };
          return parsedIngredientObject
        }
      }
    });
    const parsedRecipe = {
      ...recipe,
      ingredients: parsedRecipeIngredients
    }
    if (!parsedRecipe.ingredients.includes(null)) {
      console.log(recipe.name)
      return parsedRecipe;
    }
  } catch (err) {
    console.log(recipe.name, 'ERROR -', err)
  }
});

const outputPath = path.join(__dirname, '../../data/clean-data/clean-seed-data-total-yield-ingredients-edited.json');
fs.writeFileSync(outputPath, JSON.stringify(parsedRecipes, null, 2), 'utf8')
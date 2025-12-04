'use strict'

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, '../../seed-data/clean-data/clean-seed-data-total-yield-edited.json')

const rawData = fs.readFileSync(inputPath, 'utf8');
const recipes = JSON.parse(rawData);

// let updatedRecipes = [];
let count = 0;



for (let recipe of recipes) {
  for (let i = 0; i < recipe.ingredients.length; i++) {
    let match = recipe.ingredients[i].match('or quarter');
    if (match) {
      console.log(recipe.ingredients[i]);
      count ++
    }
  }


}

console.log(count)

// const outputPathUpdated = path.join(__dirname, '../../seed-data/clean-data/clean-seed-data-total-yield-edited-numerals.json')
// fs.writeFileSync(outputPathUpdated, JSON.stringify([...updatedRecipes], null, 2), 'utf8')



// const ONES = {
//   zero: 0,
//   one: 1,
//   two: 2,
//   three: 3,
//   four: 4,
//   five: 5,
//   six: 6,
//   seven: 7,
//   eight: 8,
//   nine: 9
// };

// const TEENS = {
//   ten: 10,
//   eleven: 11,
//   twelve: 12,
//   thirteen: 13,
//   fourteen: 14,
//   fifteen: 15,
//   sixteen: 16,
//   seventeen: 17,
//   eighteen: 18,
//   nineteen: 19
// };

// const TENS = {
//   twenty: 20,
//   thirty: 30,
//   forty: 40,
//   fifty: 50,
//   sixty: 60,
//   seventy: 70,
//   eighty: 80,
//   ninety: 90
// };

// // Simple fractions like "half", "quarter", etc.
// const FRACTIONS = {
//   half: 1 / 2,
//   third: 1 / 3,
//   quarter: 1 / 4,
//   fourth: 1 / 4,
//   fifth: 1 / 5,
//   sixth: 1 / 6,
//   seventh: 1 / 7,
//   eighth: 1 / 8,
//   ninth: 1 / 9,
//   tenth: 1 / 10
// };

// // Unicode fractions like ½
// const UNICODE_FRACTIONS = {
//   '½': 1 / 2,
//   '¼': 1 / 4,
//   '¾': 3 / 4,
//   '⅓': 1 / 3,
//   '⅔': 2 / 3
// };

// function replaceUnicodeFractions(text) {
//   // Patterns like "1½", "2 ¼", etc.
//   text = text.replace(/(\d+)\s*([½¼¾⅓⅔])/g, (_, d, fracChar) => {
//     const base = parseInt(d, 10);
//     const frac = UNICODE_FRACTIONS[fracChar] || 0;
//     return (base + frac).toString();
//   });

//   // Standalone unicode fractions like "½ cup"
//   text = text.replace(/[½¼¾⅓⅔]/g, m => {
//     const frac = UNICODE_FRACTIONS[m];
//     return frac !== undefined ? frac.toString() : m;
//   });

//   return text;
// }

// function parseNumberPhrase(phrase) {
//   phrase = phrase.toLowerCase().replace(/-/g, ' ');
//   const words = phrase.split(/\s+/);

//   let total = 0;
//   let current = 0;
//   let hasNumeric = false; // we only convert if this becomes true

//   for (let i = 0; i < words.length; i++) {
//     const w = words[i];

//     if (w === 'and') {
//       // "and" is just a connector: "one and a half"
//       continue;
//     }

//     if (w === 'a' || w === 'an') {
//       // Articles like "a"/"an" are never numeric by themselves.
//       // They just appear in phrases like "a half".
//       continue;
//     }

//     if (ONES[w] !== undefined) {
//       current += ONES[w];
//       hasNumeric = true;
//     } else if (TEENS[w] !== undefined) {
//       current += TEENS[w];
//       hasNumeric = true;
//     } else if (TENS[w] !== undefined) {
//       current += TENS[w];
//       hasNumeric = true;
//     } else if (FRACTIONS[w] !== undefined) {
//       const frac = FRACTIONS[w];

//       if (!hasNumeric && current === 0) {
//         // "half" → 0.5
//         current += frac;
//       } else {
//         // "one and a half" → 1 + 0.5
//         current += frac;
//       }

//       hasNumeric = true;
//     } else {
//       // Unknown word inside what we thought was a number phrase → bail out.
//       return null;
//     }
//   }

//   if (!hasNumeric) {
//     // something like "and" or "a" alone → don't convert
//     return null;
//   }

//   return total + current;
// }

// const NUMBER_WORDS = [
//   'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
//   'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
//   'seventeen', 'eighteen', 'nineteen',
//   'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety',
//   'half', 'third', 'quarter', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth',
//   'ninth', 'tenth'
// ];

// const NUMBER_WORD_PATTERN = NUMBER_WORDS.join('|');

// // Matches things like:
// // - "one"
// // - "twenty two"
// // - "thirty-five"
// // - "one and a half"
// // - "a half", "a quarter"
// const NUMBER_WORD_REGEX = new RegExp(
//   '\\b(?:' +
//     // Branch 1: "a half", "an eighth", etc.
//     '(?:a|an)\\s+(?:half|third|quarter|fourth|fifth|sixth|seventh|eighth|ninth|tenth)' +
//     '|' +
//     // Branch 2: "one", "twenty two", "one and a half", etc.
//     '(?:' + NUMBER_WORD_PATTERN + ')' +
//       '(?:[-\\s]+(?:' + NUMBER_WORD_PATTERN + '))*' +
//       '(?:\\s+and\\s+(?:a\\s+)?(?:' + NUMBER_WORD_PATTERN + ')(?:[-\\s]+(?:' + NUMBER_WORD_PATTERN + '))*)?' +
//   ')\\b',
//   'gi'
// );

// function replaceNumberWords(text) {
//   // STEP 1 — Unicode fractions like "1½" → "1.5"
//   text = replaceUnicodeFractions(text);

//   return text.replace(NUMBER_WORD_REGEX, (match, offset, full) => {
//     const lower = match.toLowerCase();

//     // ============================
//     //  PRONOUN "ONE" GUARD
//     // ============================
//     if (lower === 'one') {
//       const before = full.slice(Math.max(0, offset - 25), offset).toLowerCase();

//       // E.g. “if you have one”, “if you can get one”
//       if (
//         /\b(if\s+you\s+have|if\s+you\s+can\s+get|if\s+you\s+want|if\s+you\s+need|you\s+can\s+get|you\s+want|you\s+need)\s+$/.test(
//           before
//         )
//       ) {
//         return match; // Do NOT convert pronoun "one"
//       }
//     }

//     // ============================
//     //  HALF / QUARTER / THIRD — ADJECTIVAL PREFIX GUARD
//     //  e.g. half-fat, half-cooked, half-handful
//     //       quarter-pounder, quarter-turn
//     //       third-degree
//     //  These should NEVER be numeric.
//     // ============================
//     if (['half', 'quarter', 'third'].includes(lower)) {
//       const nextChar = full[offset + match.length] || '';
//       if (nextChar === '-') {
//         return match; // e.g. "half-fat" stays "half-fat"
//       }
//     }

//     // ============================
//     //  SPECIAL HALF CONTEXT GUARDS
//     // ============================
//     if (lower === 'half') {
//       const nextChar = full[offset + match.length] || '';
//       const before = full.slice(Math.max(0, offset - 15), offset).toLowerCase();
//       const after = full.slice(offset + match.length, offset + match.length + 15).toLowerCase();

//       // Case: cut in half / cut into half
//       if (/\b(in|into)\s+$/.test(before)) {
//         return match;
//       }

//       // Case: half moon / half-moon
//       if (/^\s*-?\s*moon\b/.test(after)) {
//         return match;
//       }
//     }

//     // ============================
//     //  SPICE-BLEND GUARD
//     //  e.g. "five-spice", "seven-spice"
//     // ============================
//     if ([
//       'one','two','three','four','five',
//       'six','seven','eight','nine','ten'
//     ].includes(lower)) {
//       const after = full.slice(offset + match.length, offset + match.length + 12).toLowerCase();

//       if (/^\s*-?\s*spice\b/.test(after)) {
//         return match; // Leave "five-spice", "seven-spice" unchanged
//       }
//     }

//     // ============================
//     //  NORMAL NUMBER-PHRASE PARSING
//     // ============================
//     const value = parseNumberPhrase(match);
//     return value !== null ? value.toString() : match;
//   });
// }
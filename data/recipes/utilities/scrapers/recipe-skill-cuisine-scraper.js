'use strict';

import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'node:fs';
import path from 'path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const inputPath = path.join(__dirname, '../seed-data/clean-data/clean-seed-data-total-updated.json');
const rawData = fs.readFileSync(inputPath, 'utf8');
const recipeData = JSON.parse(rawData);

( async function () {
  for (let recipe of recipeData) {
    if (!recipe.cuisine && !recipe.skillLevel) {
      console.log(recipe.name);
      const url = recipe.url;
      let recipeResponse;

      try {
        recipeResponse = await axios.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
            'AppleWebKit/537.36 (KHTML, like Gecko) ' +
            'Chrome/124.0.0.0 Safari/537.36'
          }
        })
      } catch (err) {
        console.log(`${recipe.name}: failed to reach ${url}`, `${err.message}`)
        continue;
      }
      
      const $ = cheerio.load(recipeResponse.data)

      if (!recipe.cuisine) {
        const schemaHTML = $('script[type="application/ld+json"]').first().html();
        if (schemaHTML) {
          try {
            const schema = JSON.parse(schemaHTML, null, 2);
            recipe.cuisine = schema.recipeCuisine || recipe.cuisine;
          } catch {
            console.log(`${recipe.name}: Schema does not contain data on cuisine`)
          }
        } else {
          console.log(`${recipe.name}: Page does not contain schema`)
        }
      }
      
      if (!recipe.skillLevel) {
        const postContentScriptHTML = $('script#__POST_CONTENT__').html();
        if (postContentScriptHTML) {
          try {
            const postContentScript = JSON.parse(postContentScriptHTML, null, 2);
            recipe.skillLevel = postContentScript.skillLevel || recipe.skillLevel;
          } catch {
            console.log(`${recipe.name}: Schema does not contain data on skill level`)
          }
        } else {
          console.log(`${recipe.name}: Page does not contain script`)
        }
      }

      const interval = Math.random() * 1500 + 500;
      console.log(`Waiting ${(interval / 1000).toFixed(2)} seconds before next recipe directory request...`)
      await delay(interval);
    }
  }

  const outputPath = path.join(__dirname, '../seed-data/clean-data/clean-seed-data-total-updated-further.json')
  fs.writeFileSync(outputPath, JSON.stringify(recipeData, null, 2), 'utf8')
})()
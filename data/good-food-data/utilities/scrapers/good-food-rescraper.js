'use strict';

import axios from 'axios';
import * as cheerio from 'cheerio';
import { parseStringPromise } from 'xml2js';
import fs from 'node:fs';
import path from 'path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function removeAtType (obj) {
  if (Array.isArray(obj)) {
    for (let el of obj) {
      removeAtType(el);
    }
  } else if (obj && typeof obj === 'object') {
    delete obj['@type'];
    for (let key in obj) {
      removeAtType(obj[key]);
    }
  }
}

const inputPathCleanData = path.join(__dirname, '../../seed-data/clean-data/clean-seed-data-total.json');
const cleanData = JSON.parse(fs.readFileSync(inputPathCleanData, 'utf8'));

const inputPathPartialData = path.join(__dirname, '../../seed-data/clean-data/entries-missing-mandatory-fields.json');
const partialData = JSON.parse(fs.readFileSync(inputPathPartialData, 'utf-8'));

let completeRecipeURLs = new Set(cleanData.map((recipe) => recipe.url));
let partialRecipeNames = new Set(partialData.map((recipe) => recipe.name));
let recipes = [];

( async function () {
  
  const url = 'https://www.bbcgoodfood.com/sitemap.xml'
  const directoryResponse = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
      'AppleWebKit/537.36 (KHTML, like Gecko) ' +
      'Chrome/124.0.0.0 Safari/537.36'
    }
  });

  const parsedDirectoryXml = await parseStringPromise(directoryResponse.data);
  
  for (let entry of parsedDirectoryXml.sitemapindex.sitemap) {
    if (entry.loc[0].includes('recipe')) {
      try {
        const recipeDirectoryResponse = await axios.get(entry.loc[0], {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
            'AppleWebKit/537.36 (KHTML, like Gecko) ' +
            'Chrome/124.0.0.0 Safari/537.36'
          }
        });
        const parsedRecipeDirectoryXml = await parseStringPromise(recipeDirectoryResponse.data);
        for (let entry of parsedRecipeDirectoryXml.urlset.url) {
          if (completeRecipeURLs.has(entry.loc[0])) {
            continue;
          }
          try {
            const recipeResponse = await axios.get(entry.loc[0], {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
                'AppleWebKit/537.36 (KHTML, like Gecko) ' +
                'Chrome/124.0.0.0 Safari/537.36'
              }
            });
            const $ = cheerio.load(recipeResponse.data)
            const schemaHTML = $('script[type="application/ld+json"]').first().html();
            const postContentScriptHTML = $('script#__POST_CONTENT__').html();
            if (schemaHTML && postContentScriptHTML) {
              const recipe = {
                name: null,
                description: null,
                image: [],
                url: null,
                keywords: null,
                prepTime: null,
                cookTime: null,
                totalTime: null,
                recipeYield: 0,
                nutrition: [],
                recipeCategory: null,
                recipeIngredients: [],
                recipeInstructions: [],
                cuisine: null,
                skillLevel: null
              }
              const schemaJSON = JSON.parse(schemaHTML);
              if (partialRecipeNames.has(schemaJSON.name)) {
                continue;
              }
              try {
                const schemaJSON = JSON.parse(schemaHTML);
                for (let prop in recipe) {
                  recipe[prop] = schemaJSON[prop];
                }
                recipe.recipeIngredients = schemaJSON.recipeIngredient;
                removeAtType(recipe);
              } catch (err) {
                console.error(`Error parsing schema.org JSON-LD for ${entry.loc[0]}:`, err.message);
              }
              try {
                const postContentScriptJSON = JSON.parse(postContentScriptHTML);
                recipe.skillLevel = postContentScriptJSON.skillLevel;
              } catch (err) {
                console.error(`Error parsing postContentScript JSON-LD for ${entry.loc[0]}:`, err.message);
              }
              recipe.forcedURL = entry.loc[0];
              recipes.push(recipe);
            }
          } catch (err) {
            console.log(`Error fetching recipe page and extracting HTML: ${err.message}`);
            console.log(`Recipe library length is at ${recipes.length} recipes`);
          }

          const interval = Math.random() * 1000 + 500;
          console.log(`Waiting ${(interval / 1000).toFixed(2)} seconds before next recipe page request...`);
          await delay(interval);
        }
      } catch (err) {
        console.log(`Error fetching recipe directory: ${err.message}`);
        console.log(`Recipe library length is at ${recipes.length} recipes`);
      }

      const fileIDMatches = (entry.loc[0]).match(/\p{N}{4}-Q\p{N}/u);
      const fileID = fileIDMatches ? fileIDMatches[0] : 'unknown';

      const outputPath = path.join(__dirname, `../../seed-data/raw-data/missing-raw-seed-data-${fileID}.json`);

      fs.writeFileSync(outputPath, JSON.stringify(recipes, null, 2), 'utf8');
      console.log(`Successfully scraped all additional recipes for ${fileID}. Library length: ${recipes.length} recipes`)
      
      recipes = [];
      
      const interval = Math.random() * 4000 + 2000;
      console.log(`Waiting ${(interval / 1000).toFixed(2)} seconds before next recipe directory request...`)
      await delay(interval);
    }
  }
})()





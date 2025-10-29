'use strict';

import axios from 'axios';
import * as cheerio from 'cheerio';
import { parseStringPromise } from 'xml2js';

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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
      console.log(entry.loc[0]);
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
          console.log(entry.loc[0])
          try {
            const recipeResponse = await axios.get(entry.loc[0]);
            const $ = cheerio.load(recipeResponse.data)
            const recipeSchema = $('script[type="application/ld+json"]').first()
            const schemaText = recipeSchema.html();
              if (schemaText) {
                try {
                  const schemaJson = JSON.parse(schemaText);
                  console.log(schemaJson);
                } catch (err) {
                  console.error("Error parsing JSON-LD:", err.message);
                }
              }
            // let schemas = [];
            // $('script[type="application/ld+json"]').each((i, elem) => {
            //   try {
            //     console.log(`This is schema ${i}`);
            //     const json = JSON.parse($(elem).html());
            //     schemas.push(json);
            //     console.log(schemas);
            //   } catch (err) {
            //     console.log(`Error parsing JSON-LD schema: ${err.message}`);
            //   }
            // });
          } catch (err) {
            console.log(`Error fetching recipe page and extracting HTML: ${err.message}`);
          }

          const interval = Math.random() * 4000 + 1000
          console.log(`Waiting ${(interval / 1000).toFixed(2)} seconds before next recipe page request...`)
          await delay(interval);
        }
      } catch (err) {
        console.log(`Error fetching recipe directory: ${err.message}`);
      }

      const interval = Math.random() * 4000 + 1000
      console.log(`Waiting ${(interval / 1000).toFixed(2)} seconds before next recipe directory request...`)
      await delay(interval);
    }
  }
})()



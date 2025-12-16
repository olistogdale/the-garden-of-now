'use strict'

// const fs = require('fs');
// const path = require('path');

import fs from 'node:fs';
import path from 'node:path'

const inputPath = path.join(__dirname, './ingredients.json')

const rawData = fs.readFileSync(inputPath, 'utf8');
const ingredients = JSON.parse(rawData);

const finalListSeasonal = {
  meat: [],
  fish: [],
  vegetables: [],
  fruit: [],
  nutsAndHerbs: []
}

for (let season of ingredients) {
  if (season.type === 'seasonal') {
    for (let ingredientsCategory in finalListSeasonal) {
      for (let ingredient of season[ingredientsCategory]) {
        const existing = finalListSeasonal[ingredientsCategory].find((i) => i.name === ingredient);
        if (existing) {
          existing.seasonality.push(season.month);
        } else {
          finalListSeasonal[ingredientsCategory].push(
            {
              name: ingredient,
              seasonality: [season.month]
            }
          )
        }
      }
    }
  }
}

const outputPath = path.join(__dirname, './recipe-reorganised.json')

fs.writeFileSync(outputPath, JSON.stringify(finalListSeasonal, null, 2), 'utf8');
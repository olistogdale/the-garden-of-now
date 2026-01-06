'use strict';

import { mongoose } from '../../database/db';

import type { NonSeasonalIngredient, NonSeasonalIngredientCollection } from '../../../../data/ingredients/types/ingredientTypes';

const { Schema, model } = mongoose;

const NonSeasonalIngredientSchema = new Schema <NonSeasonalIngredient> (
  {
    name: { type: String, required: true, trim: true },
    altNames: { type: [String] , default: undefined },
  }
);

const NonSeasonalIngredientCollectionSchema = new Schema <NonSeasonalIngredientCollection> (
  {
    curedMeat: { type:[NonSeasonalIngredientSchema], default: [] },
    curedFish: { type:[NonSeasonalIngredientSchema], default: [] },
    cheese: { type:[NonSeasonalIngredientSchema], default: [] },
    oil: { type:[NonSeasonalIngredientSchema], default: [] },
    vinegar: { type:[NonSeasonalIngredientSchema], default: [] },
    condiments: { type:[NonSeasonalIngredientSchema], default: [] },
    herbsAndSpices: { type:[NonSeasonalIngredientSchema], default: [] },
    stocksAndGravies: { type:[NonSeasonalIngredientSchema], default: [] },
    cannedVegetables: { type:[NonSeasonalIngredientSchema], default: [] },
    noodles: { type:[NonSeasonalIngredientSchema], default: [] },
    nuts: { type:[NonSeasonalIngredientSchema], default: [] },
    grains: { type:[NonSeasonalIngredientSchema], default: [] },
    pulses: { type:[NonSeasonalIngredientSchema], default: [] },
    breads: { type:[NonSeasonalIngredientSchema], default: [] },
    biscuits: { type:[NonSeasonalIngredientSchema], default: [] },
    crisps: { type:[NonSeasonalIngredientSchema], default: [] },
    dairy: { type:[NonSeasonalIngredientSchema], default: [] },
    eggs: { type:[NonSeasonalIngredientSchema], default: [] },
    baking: { type:[NonSeasonalIngredientSchema], default: [] },
    spreads: { type:[NonSeasonalIngredientSchema], default: [] },
    teaAndCoffee: { type:[NonSeasonalIngredientSchema], default: [] },
    confectionery: { type:[NonSeasonalIngredientSchema], default: [] },
    alcohol: { type:[NonSeasonalIngredientSchema], default: [] },
    juice: { type:[NonSeasonalIngredientSchema], default: [] },
    water: { type:[NonSeasonalIngredientSchema], default: [] }
  }
);

export const nonSeasonalIngredientModel = model('NonSeasonalIngredient', NonSeasonalIngredientCollectionSchema);
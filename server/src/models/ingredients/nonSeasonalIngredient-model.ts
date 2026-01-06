'use strict';

import { mongoose } from '../../database/db';

import type { NonSeasonalIngredient, NonSeasonalIngredientCollection } from '../../../../data/ingredients/types/ingredientTypes';

const { Schema, model } = mongoose;

const nonSeasonalIngredientSchema = new Schema <NonSeasonalIngredient> (
  {
    name: { type: String, required: true, trim: true },
    altNames: { type: [String] , default: undefined },
  }
);

const nonSeasonalIngredientCollectionSchema = new Schema <NonSeasonalIngredientCollection> (
  {
    curedMeat: { type:[nonSeasonalIngredientSchema], default: [] },
    curedFish: { type:[nonSeasonalIngredientSchema], default: [] },
    cheese: { type:[nonSeasonalIngredientSchema], default: [] },
    oil: { type:[nonSeasonalIngredientSchema], default: [] },
    vinegar: { type:[nonSeasonalIngredientSchema], default: [] },
    condiments: { type:[nonSeasonalIngredientSchema], default: [] },
    herbsAndSpices: { type:[nonSeasonalIngredientSchema], default: [] },
    stocksAndGravies: { type:[nonSeasonalIngredientSchema], default: [] },
    cannedVegetables: { type:[nonSeasonalIngredientSchema], default: [] },
    noodles: { type:[nonSeasonalIngredientSchema], default: [] },
    nuts: { type:[nonSeasonalIngredientSchema], default: [] },
    grains: { type:[nonSeasonalIngredientSchema], default: [] },
    pulses: { type:[nonSeasonalIngredientSchema], default: [] },
    breads: { type:[nonSeasonalIngredientSchema], default: [] },
    biscuits: { type:[nonSeasonalIngredientSchema], default: [] },
    crisps: { type:[nonSeasonalIngredientSchema], default: [] },
    dairy: { type:[nonSeasonalIngredientSchema], default: [] },
    eggs: { type:[nonSeasonalIngredientSchema], default: [] },
    baking: { type:[nonSeasonalIngredientSchema], default: [] },
    spreads: { type:[nonSeasonalIngredientSchema], default: [] },
    teaAndCoffee: { type:[nonSeasonalIngredientSchema], default: [] },
    confectionery: { type:[nonSeasonalIngredientSchema], default: [] },
    alcohol: { type:[nonSeasonalIngredientSchema], default: [] },
    juice: { type:[nonSeasonalIngredientSchema], default: [] },
    water: { type:[nonSeasonalIngredientSchema], default: [] }
  }
);

export const nonSeasonalIngredientModel = model('NonSeasonalIngredient', nonSeasonalIngredientCollectionSchema);
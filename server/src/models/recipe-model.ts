'use strict'

import { mongoose } from '../database/db';

import type { ImageDataT, NutritionDataT, IngredientT, IngredientDataT, InstructionT, RecipeT } from '../../../data/recipes/types/recipe-types';

const { Schema, model } = mongoose;

const ImageSchema = new Schema <ImageDataT> (
  {
    url: { type: String, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true }
  }
)

const NutritionDataSchema = new Schema <NutritionDataT> (
  {
    calories: { type: String, default: undefined },
    fatContent: { type: String, default: undefined },
    saturatedFatContent: { type: String, default: undefined },
    carbohydrateContent: { type: String, default: undefined },
    sugarContent: { type: String, default: undefined },
    fiberContent: { type: String, default: undefined },
    proteinContent: { type: String, default: undefined },
    sodiumContent: { type: String, default: undefined }
  }
)

const IngredientSchema = new Schema <IngredientT> (
  {
    quantity: { type: String, default: undefined },
    description: { type: String, default: undefined },
    ingredient: { type: String, required: true },
    rawIngredients: { type: [String], required: true },
    preparation: { type: String, default: undefined }
  }
)

const IngredientDataSchema = new Schema <IngredientDataT> (
  {
    text: { type: String, required: true },
    optional: { type: Boolean, required: true },
    ingredientOptions: { type: [IngredientSchema], default: undefined },
  }
)

const InstructionSchema = new Schema <InstructionT> (
  {
    text: { type: String, required: true }
  }
)

const RecipeSchema = new Schema <RecipeT> (
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: [ImageSchema], required: true },
    url: { type: String, required: true },
    keywords: { type: String, default: undefined },
    prepTime: { type: String, default: undefined },
    cookTime: { type: String, default: undefined },
    totalTime: { type: String, default: undefined },
    nutrition: { type: NutritionDataSchema, default: undefined },
    cuisine: { type: String, default: undefined },
    skillLevel: { type: String, default: undefined },
    yield: { type: String, default: undefined },
    category: { type: String, default: undefined },
    ingredients: { type: [IngredientDataSchema], required: true },
    instructions: { type: [InstructionSchema], required: true }
  }
)

export const recipeModel = model('Recipe', RecipeSchema);
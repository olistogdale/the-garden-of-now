import { describe, it, expect } from "vitest";

import { isInSeason } from "./seasonality-utils";

import type { RecipeCardT } from "../../../data/recipes/types/recipe-types";

describe('isInSeason', () => {
  const hamAndCheeseSandwich = {
    groupedIngredients: [
      ['ham'], ['cheese'], ['bread'], ['lettuce'], ['mayonnaise'], ['mustard'], ['salt'], ['pepper']
    ]
  }

  const tunaMayoSandwich = {
    groupedIngredients: [
      ['tuna'], ['cucumber'], ['bread'], ['mayonnaise'], ['salt'], ['pepper']
    ]
  }

  const fishAndChips = {
    groupedIngredients: [
      ['cod', 'haddock', 'plaice'], ['potato'], ['pea'], ['tartare sauce'], ['salt'], ['pepper']
    ]
  }

  const fishPie = {
    groupedIngredients: [
      ['cod', 'salmon', 'hake'], ['lobster', 'prawn', 'shrimp'], ['potato'], ['cream'], ['wine'], ['parsley'], ['salt'], ['pepper']
    ]
  }

  const emptyRecipe = {
    groupedIngredients: []
  }

  const corruptedRecipe = {
    groupedIngredients: [
      [], [], ['salt'], ['pepper']
    ]
  }

  const ingredients = new Set(['ham', 'cheese', 'bread', 'lettuce', 'mayonnaise', 'mustard', 'salt', 'pepper', 'cucumber', 'cod', 'haddock', 'plaice', 'shrimp', 'potato', 'pea', 'tartare sauce', 'tomato ketchup', 'cream', 'wine', 'parsley'])

  const emptyIngredients = new Set([])

  it.each([
    { name: 'when recipe contains only seasonal ingredients', inputRecipe: hamAndCheeseSandwich, inputIngredients: ingredients, output: true },
    { name: 'when recipe contains non-seasonal ingredients', inputRecipe: tunaMayoSandwich, inputIngredients: ingredients, output: false },
    { name: 'when recipe contains seasonal ingredient options', inputRecipe: fishPie, inputIngredients: ingredients, output: true },
    { name: 'when recipe contains ingredient options, and at least one is seasonal', inputRecipe: fishAndChips, inputIngredients: ingredients, output: true },
    { name: 'when recipe is missing all ingredients', inputRecipe: emptyRecipe, inputIngredients: ingredients, output: false },
    { name: 'when recipe is missing at least one ingredient', inputRecipe: corruptedRecipe, inputIngredients: ingredients, output: false },
    { name: 'when ingredients are missing', inputRecipe: fishPie, inputIngredients: emptyIngredients, output: false },
  ])('returns "$output" "$name"', ({inputRecipe, inputIngredients, output}) => {
    expect(isInSeason(inputRecipe as any, inputIngredients)).toBe(output)
  })

  it('is deterministic', () => {
    const first = isInSeason(hamAndCheeseSandwich as RecipeCardT, ingredients);
    const second = isInSeason(hamAndCheeseSandwich as RecipeCardT, ingredients);
    expect(first).toBe(second)
  })
})
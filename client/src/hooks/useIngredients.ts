import { useContext } from "react";

import { IngredientsContext } from '../context/ingredients-context'

export function useIngredients() {
  const ctx = useContext(IngredientsContext);
  if (!ctx) {
    throw new Error('useIngredients must be used within IngredientsProvider');
  }
  return ctx;
}
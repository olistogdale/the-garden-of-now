import { useContext } from "react";

import { AvailableIngredientsContext } from '../context/available-ingredients-context'

export function useAvailableIngredients() {
  const ctx = useContext(AvailableIngredientsContext);
  if (!ctx) {
    throw new Error('useAvailableIngredients must be used within AvailableIngredientsProvider');
  }
  return ctx;
}
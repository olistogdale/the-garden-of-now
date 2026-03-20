import { useContext, useMemo } from 'react';
import { IngredientsContext } from '../context/ingredients-context';

export function useIngredients() {
  const ctx = useContext(IngredientsContext);

  if (!ctx) {
    throw new Error('useIngredients must be used within IngredientsProvider');
  }

  const stableIngredients = useMemo(() => {
    if (!ctx.ingredients) return ctx.ingredients;

    // IMPORTANT: copy before sorting
    return [...ctx.ingredients].sort();
  }, [ctx.ingredients]);

  return {
    ...ctx,
    ingredients: stableIngredients,
  };
}

import { createContext } from 'react';

export type Status = 'idle' | 'loading' | 'success' | 'error';

export type AvailableIngredientsContextValue = {
  month: string | null,
  availableIngredients: string[] | null,
  status: Status,
  error: string | null
};

export const AvailableIngredientsContext = createContext <AvailableIngredientsContextValue | null> (null);
import { createContext } from 'react';

import type { IngredientsContextValueT } from '../types/ingredient-types'

export const IngredientsContext = createContext <IngredientsContextValueT | null> (null);
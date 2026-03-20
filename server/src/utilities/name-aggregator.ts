import { normalize, isNonEmpty } from './string-utils';

import type { GenericIngredientT } from '../../../data/ingredients/types/ingredient-types';

export const nameAggregator = function (array: GenericIngredientT[]) {
  return array
    .flatMap((el) => (el.altNames ? [el.name, ...el.altNames] : [el.name]))
    .map(normalize)
    .filter(isNonEmpty);
};

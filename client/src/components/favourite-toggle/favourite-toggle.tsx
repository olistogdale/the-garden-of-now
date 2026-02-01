import { useAuth } from "../../hooks/useAuth";

import type { RecipeT } from "../../../../data/recipes/types/recipe-types";

export type Props = {
  recipe: RecipeT
}

export function FavouriteToggle({ recipe }: Props) {
  const { isInFavourites, toggleFavourite } = useAuth();

  const recipeId = recipe._id;
  const recipeName = recipe.name;

  return (
    <div className="favourite-toggle">
      <button className="favourite-toggle__button" onClick={() => toggleFavourite(recipeId, recipeName)}>
          {isInFavourites(recipeId) ? "-" : "+" }
      </button>
    </div>
  )
}
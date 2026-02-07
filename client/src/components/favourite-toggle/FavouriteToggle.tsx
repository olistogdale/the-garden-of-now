import { useAuth } from "../../hooks/useAuth";

import type { RecipeCardT, RecipeT } from "../../../../data/recipes/types/recipe-types";

export type Props = {
  recipe: RecipeCardT | RecipeT
} & React.HTMLAttributes<HTMLDivElement>

export function FavouriteToggle({ recipe }: Props) {
  const { auth, isInFavourites, toggleFavourite } = useAuth();

  if (!auth) return null;

  const recipeId = recipe._id;
  const recipeName = recipe.name;

  return (
    <div className="favourite-toggle">
      <button type="button" className="favourite-toggle__button" onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavourite(recipeId, recipeName)}
      }
      >
          {isInFavourites(recipeId) ? "-" : "+" }
      </button>
    </div>
  )
}
import './RecipeCard.css';

import { Link } from 'react-router-dom';

import { pickBestImage, getDisplayTime, normalizeSkill } from './recipeCard.utilities';

import type { RecipeCardType } from '../../../../data/recipes/types/recipe-types'

type Props = {
  recipe: RecipeCardType;
};

export function RecipeCard({ recipe }: Props) {
  const img = pickBestImage(recipe.image);
  const time = getDisplayTime(recipe);
  const skill = normalizeSkill(recipe.skillLevel);

  return (
    <article className="recipe-card-container">
      <Link to={`/recipes/${recipe._id}`} className="recipe-card__link" aria-label={recipe.name}>
        <div className="recipe-card__media">
          {img ? (
            <img
              src={img.url}
              alt={recipe.name}
              loading="lazy"
              className="recipe-card__img"
            />
          ) : (
            <div className="recipe-card__img-fallback" aria-hidden="true" />
          )}
        </div>

        <div className="recipe-card__body">
          <h3 className="recipe-card__title">{recipe.name}</h3>

          {(time || skill) && (
            <div className="recipe-card__meta">
              {time && <span className="pill">{time}</span>}
              {skill && <span className="pill">{skill}</span>}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
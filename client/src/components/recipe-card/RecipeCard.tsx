import './RecipeCard.css';

import { Link } from 'react-router-dom';

import { parseImage } from '../../utilities/parse-image';
import { parseTime } from '../../utilities/parse-time';
import { parseSkillLevel } from '../../utilities/parse-skill-level';

import type { RecipeCardT } from '../../../../data/recipes/types/recipe-types'
import { FavouriteToggle } from '../favourite-toggle/FavouriteToggle';

type Props = {
  recipe: RecipeCardT;
}

export function RecipeCard({ recipe }: Props) {
  const img = parseImage(recipe.image);
  const time = parseTime(recipe);
  const skill = parseSkillLevel(recipe.skillLevel);

  return (
    <div className="recipe-card">
      <div className="recipe-card__fav-toggle">
        <FavouriteToggle recipe={recipe}/>
      </div>
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
    </div>
  );
}
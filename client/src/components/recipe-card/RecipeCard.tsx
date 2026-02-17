import './RecipeCard.css';

import { Link } from 'react-router-dom';

import { parseImage } from '../../utilities/parse-image';
import { parseTime } from '../../utilities/parse-time';
import { parseSkillLevel } from '../../utilities/parse-skill-level';
import { FavouriteToggle } from '../favourite-toggle/FavouriteToggle';
import { useAutoMarquee } from '../../hooks/useAutoMarquee';

import type { RecipeCardT } from '../../../../data/recipes/types/recipe-types';

type Props = {
  recipe: RecipeCardT;
}

export function RecipeCard({ recipe }: Props) {
  const img = parseImage(recipe.image);
  const time = parseTime(recipe);
  const skill = parseSkillLevel(recipe.skillLevel);
  
  const titleRef = useAutoMarquee([recipe.name]);
  
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
          <div className="recipe-card__title" title={recipe.name} ref={titleRef}>
            <h3 className="recipe-card__title-text">
            {recipe.name.toUpperCase()}
            </h3>
          </div>
          {(time || skill) && (
            <div className="recipe-card__meta">
              {time && <span className="recipe-card__pill">{time}</span>}
              {skill && <span className="recipe-card__pill">{skill}</span>}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}

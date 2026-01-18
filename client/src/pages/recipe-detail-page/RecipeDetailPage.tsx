import './RecipeDetailPage.css';

import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';

import { parseImage } from '../../utilities/parse-image';
import { parseTime } from '../../utilities/parse-time';
import { parseSkillLevel } from '../../utilities/parse-skill-level';

import type { RecipeCardT } from '../../../../data/recipes/types/recipe-types';

// ---- Mock data for Stage 1 ----
const MOCK_RECIPES: RecipeCardT[] = [
  {
    _id: '1',
    name: 'Navarin of lamb & spring vegetables',
    image: [
      {
        url: 'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/recipe-image-legacy-id-221500_11-4e299a3.jpg?resize=440,400',
        width: 440,
        height: 400,
      },
      {
        url: 'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/recipe-image-legacy-id-221500_11-4e299a3.jpg?resize=960,872',
        width: 960,
        height: 872,
      },
    ],
    prepTime: '20 mins',
    cookTime: '1 hr 10 mins',
    skillLevel: 'Easy',
  },
  {
    _id: '2',
    name: 'Lemon herb roast chicken',
    image: [],
    totalTime: '1 hr 30 mins',
    skillLevel: 'Medium',
  },
];

export function RecipeDetailPage() {
  const { id } = useParams();

  const recipe = useMemo(() => MOCK_RECIPES.find((r) => r._id === id) ?? null, [id]);

  if (!recipe) {
    return (
      <section className="recipe-detail-container">
        <div className="recipe-detail__topbar">
          <Link to="/recipes" className="textlink">
            ← Back to recipes
          </Link>
        </div>

        <div className="recipe-detail__empty">
          <h1 className="recipe-detail__title">Recipe not found</h1>
          <p className="recipe-detail__subtitle">
            That recipe doesn’t exist (or hasn’t loaded yet).
          </p>
          <Link to="/recipes" className="btn btn-primary">
            Browse recipes
          </Link>
        </div>
      </section>
    );
  }

  const heroImg = parseImage(recipe.image);
  const time = parseTime(recipe);
  const skill = parseSkillLevel(recipe.skillLevel);

  return (
    <div className="recipe-detail-container">
      <section className="recipe-detail__topbar">
        <Link to="/recipes" className="textlink">
          ← Back to recipes
        </Link>
      </section>

      <section className="recipe-detail__header">
        <h1 className="recipe-detail__title">{recipe.name}</h1>

        {(time || skill) && (
          <div className="recipe-detail__meta">
            {time && <span className="pill">{time}</span>}
            {skill && <span className="pill">{skill}</span>}
          </div>
        )}
      </section>

      <section className="recipe-detail__hero" aria-label="Recipe image">
        {heroImg ? (
          <img
            className="recipe-detail__img"
            src={heroImg.url}
            alt={recipe.name}
            loading="eager"
          />
        ) : (
          <div className="recipe-detail__img-fallback" aria-hidden="true" />
        )}
      </section>

      {/* Stage 1 placeholder content */}
      <section className="recipe-detail__content">
        <div className="card">
          <h2 className="card__title">Coming next</h2>
          <p className="card__text">
            Ingredients + method will appear here once the detail endpoint is wired up.
          </p>
        </div>

        <div className="card">
          <h2 className="card__title">Tip</h2>
          <p className="card__text">
            Once you fetch the full recipe, you can render ingredients in a list and method steps as
            an ordered list.
          </p>
        </div>
      </section>
    </div>
  );
}
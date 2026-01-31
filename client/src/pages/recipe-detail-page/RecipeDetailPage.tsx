import './RecipeDetailPage.css';

import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

import { StatusPanel } from '../../components/status-panel/StatusPanel';
import { parseImage } from '../../utilities/parse-image';
import { parseTime } from '../../utilities/parse-time';
import { parseSkillLevel } from '../../utilities/parse-skill-level';
import { getRecipeByID } from '../../services/recipes-service';

import type { RecipeT } from '../../../../data/recipes/types/recipe-types';
import type { StatusT } from '../../types/status-types';

export function RecipeDetailPage() {
  const { id } = useParams <{ id: string }>();

  const [recipe, setRecipe] = useState <RecipeT | null > (null);
  const [recipeStatus, setRecipeStatus] = useState <StatusT> ('idle');
  const [recipeError, setRecipeError] = useState <string | null> (null)

  useEffect(() => {
    if (!id) return;
    
    const controller = new AbortController();
    const timeoutID = window.setTimeout(() => controller.abort(), 10000);

    const loadRecipe = async function() {
      try {
        setRecipeStatus('loading');
        setRecipeError(null)

        const {recipe} = await getRecipeByID(id, controller.signal);

        setRecipe(recipe);
        setRecipeStatus('success');
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;

        setRecipeStatus('error');
        setRecipeError(err instanceof Error? err.message : 'Unknown error')
      }
    }

    loadRecipe()

    return () => {
      clearTimeout(timeoutID);
      controller.abort();
    }
  }, [id])

  if (recipeStatus === 'idle' || recipeStatus === 'loading') {
    return (
      <StatusPanel title="Recipe" message="Loading recipe…" />
    )
  }

  if (recipeStatus === 'error') {
    return (
      <StatusPanel
        title="Recipe"
        message={`Couldn’t load recipe${recipeError ? `: ${recipeError}` : '.'}`}
      />
    )
  }

  if (!recipe) {
    return (
      <StatusPanel title="Recipe" message="Recipe not found." />
    )
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

  // return (
  //   <div className="recipe-detail-page">
  //     <header className="recipe-detail-page__header">
  //       <button type="button" onClick={() => navigate(-1)} className="recipe-detail-page__back">
  //         ← Back
  //       </button>

  //       <h1 className="recipe-detail-page__title">{recipe.name}</h1>

  //       {/* Example: render first image if exists */}
  //       {recipe.image?.[0]?.url && (
  //         <img
  //           className="recipe-detail-page__image"
  //           src={recipe.image[0].url}
  //           alt={recipe.name}
  //         />
  //       )}

  //       <div className="recipe-detail-page__meta">
  //         {/* Adapt these fields to your real recipe shape */}
  //         {recipe.totalTime ? <span>Total: {recipe.totalTime}</span> : null}
  //         {recipe.prepTime ? <span>Prep: {recipe.prepTime}</span> : null}
  //         {recipe.cookTime ? <span>Cook: {recipe.cookTime}</span> : null}
  //         {recipe.skillLevel ? <span>Skill: {recipe.skillLevel}</span> : null}
  //       </div>
  //     </header>

  //     <main className="recipe-detail-page__content">
  //       {recipe.description ? (
  //         <p className="recipe-detail-page__description">{recipe.description}</p>
  //       ) : null}

  //       {/* Ingredients */}
  //       {Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 && (
  //         <section className="recipe-detail-page__section">
  //           <h2>Ingredients</h2>
  //           <ul>
  //             {recipe.ingredients.map((ing, idx) => (
  //               <li key={idx}>
  //                 {/* adapt to your ingredient object */}
  //                 {'text' in ing ? (ing as any).text : String(ing)}
  //               </li>
  //             ))}
  //           </ul>
  //         </section>
  //       )}

  //       {/* Method / steps */}
  //       {Array.isArray((recipe as any).method) && (recipe as any).method.length > 0 && (
  //         <section className="recipe-detail-page__section">
  //           <h2>Method</h2>
  //           <ol>
  //             {(recipe as any).method.map((step: string, idx: number) => (
  //               <li key={idx}>{step}</li>
  //             ))}
  //           </ol>
  //         </section>
  //       )}
  //     </main>
  //   </div>
  // );
}
import './RecipeDetailPage.css';

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { StatusPanel } from '../../components/status-panel/StatusPanel';
import { parseImage } from '../../utilities/parse-image';
import { durationToString, parseDuration } from '../../utilities/parse-time';
import { parseIngredients } from '../../utilities/parse-ingredients';
import { parseInstructions } from '../../utilities/parse-instructions';
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

  const img = parseImage(recipe.image);
  const name = recipe.name;
  const description = recipe.description;
  const prepTime = parseDuration(recipe.prepTime);
  const prepTimeString = durationToString(prepTime);
  const cookTime = parseDuration(recipe.cookTime);
  const cookTimeString = durationToString(cookTime);
  const totalTime = parseDuration(recipe.totalTime);
  const totalTimeString = durationToString(totalTime);
  const skill = recipe.skillLevel;
  const cuisine = recipe.cuisine;
  const servings = recipe.yield;
  const ingredients = parseIngredients(recipe.ingredients);
  const instructions = parseInstructions(recipe.instructions);

  console.log(recipe.prepTime);
  console.log(prepTime);
  console.log(prepTimeString);

  return (
    <div className="recipe-detail">
      <section className="recipe-detail__hero" aria-label="Recipe image & information">
        <div className="recipe-detail__header-blank"/>
        
        <div className="recipe-detail__info-container">
          {img
            ? <img
                className="recipe-detail__img"
                src={img.url}
                alt={name}
                loading="eager"
              />
            : <div className="recipe-detail__img-fallback" aria-hidden="true" />
          }
          
          <div className="recipe-detail__info">
            <h1 className="recipe-detail__title">{name.toUpperCase()}</h1>
            <p className="recipe-detail__description">{description}</p>
            {(prepTime || cookTime || totalTime) && (
              <div className="recipe-detail__meta">
                {prepTime && <span className="pill pill-time">Prep: {prepTimeString}</span>}
                {cookTime && <span className="pill pill-time">Cook: {cookTimeString} </span>}
                {totalTime && <span className="pill pill-time--total">Total: {totalTimeString} </span>}
              </div>
            )}
            {(cuisine || skill || servings) && (
              <div className="recipe-detail__meta">
                {skill && <span className="pill pill-info">{skill}</span>}
                {servings && <span className="pill pill-info">{servings}</span>}
                {cuisine && <span className="pill pill-info--cuisine">{cuisine}</span>}              
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="recipe-detail__ingredients">
        <h3 className="recipe-detail__ingredient-title">INGREDIENTS</h3>
        {ingredients.map((ingredient: string) => (
          <div className="recipe-detail__ingredient-line">
            {ingredient}
          </div>
        ))}
      </section>

      <section className="recipe-detail__instructions">
        <h3 className="recipe-detail__instruction-title">INSTRUCTIONS</h3>
        {instructions.map((instruction: string, i: number) => (
          <div className="recipe-detail__instruction">
            <h4>STEP {i + 1}</h4>
            <p>{instruction}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
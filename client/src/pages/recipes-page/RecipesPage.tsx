import './RecipesPage.css';

import { useEffect, useMemo, useState } from 'react';

import { RecipeCard } from '../../components/recipe-card/RecipeCard';
import { useIngredients } from '../../hooks/useIngredients.ts';
import { fetchRecipes } from '../../services/recipes-service.ts';
import { getSessionKey } from '../../utilities/session-key.ts';
import { StatusPanel } from '../../components/status-panel/StatusPanel.tsx';
import { month } from '../../utilities/generate-month.ts';

import type { RecipeCardT } from '../../../../data/recipes/types/recipe-types'
import type { StatusT } from '../../types/status-types'

export function RecipesPage() {
  const { ingredients, ingredientsStatus, ingredientsError } = useIngredients();
  const seed = getSessionKey();

  const [recipes, setRecipes] = useState <RecipeCardT[]> ([]);
  const [totalCount, setTotalCount] = useState <number | null> (null);
  const [page, setPage] = useState <number> (1);
  const [totalPages, setTotalPages] = useState <number | null> (null);
  const [limit, setLimit] = useState <number> (24);
  const [recipesStatus, setRecipesStatus] = useState <StatusT> ('idle');
  const [recipesError, setRecipesError] = useState <string | null> (null);

  const ingredientsKey = useMemo(
    () => (ingredients ? ingredients.join('|') : ''),
    [ingredients]
  )

  useEffect(() => {
    if (ingredientsStatus !== 'success' || !ingredients) return;

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 10000)

    const loadRecipes = async function() {
      try {
        setRecipesStatus('loading');
        setRecipesError(null);

        const {
          recipes,
          totalCount,
          totalPages
        } = await fetchRecipes({ingredients, seed}, page, limit, controller.signal);

        setRecipes(recipes);
        setTotalCount(totalCount);
        setTotalPages(totalPages);
        setRecipesStatus('success');
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;

        setRecipesStatus('error');
        setRecipesError(err instanceof Error? err.message : 'Unknown error')
      }
    }

    loadRecipes();
    
    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [ingredientsKey, ingredientsStatus, seed, page, limit]);

  useEffect(() => {
    if (ingredientsStatus !== 'success' || !ingredients) return;
    setPage(1);
  }, [ingredientsKey, ingredientsStatus, seed]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const canSelectPrevious = page > 1;
  const canSelectNext = totalPages !== null && page < totalPages;

  // ---- Ingredients gate ----
  if (ingredientsStatus === 'idle' || ingredientsStatus === 'loading') {
    return <StatusPanel title="Recipes" message="Loading seasonal ingredients…" />;
  }

  if (ingredientsStatus === 'error') {
    return (
      <StatusPanel
        title="Recipes"
        message={`Couldn’t load seasonal ingredients${ingredientsError ? `: ${ingredientsError}` : '.'}`}
      />
    );
  }

  // ---- Recipes gate ----
  if (recipesStatus === 'idle' || recipesStatus === 'loading') {
    return <StatusPanel title="Recipes" message="Loading recipes…" />;
  }

  if (recipesStatus === 'error') {
    return (
      <StatusPanel
        title="Recipes"
        message={`Couldn’t load recipes${recipesError ? `: ${recipesError}` : '.'}`}
      />
    );
  }

  // ---- Success ----
  return (
    <div className="recipes-page-container">
      <section className="recipes-page__pagination">
        <button type="button" onClick={() => setPage(1)} disabled={!canSelectPrevious}>
          First
        </button>

        <button
          type="button"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={!canSelectPrevious}
        >
          Prev
        </button>

        <span>
          Page {page} of {totalPages ?? 1}
        </span>

        <button
          type="button"
          onClick={() => setPage((p) => p + 1)}
          disabled={!canSelectNext}
        >
          Next
        </button>

        <button
          type="button"
          onClick={() => totalPages && setPage(totalPages)}
          disabled={!canSelectNext}
        >
          Last
        </button>

        <button
          type="button"
          onClick={() => {
            setLimit(24);
            setPage(1);
          }}
          disabled={limit===24}
        >
          24
        </button>
        <button
          type="button"
          onClick={() => {
            setLimit(48);
            setPage(1);
          }}
          disabled={limit===48}
        >
          48
        </button>
      </section>

      
      <section className="recipes-page__header">
        <h1 className="recipes-page__title">Recipes</h1>
        <p className="recipes-page__subtitle">Showing {totalCount} recipes for {month}</p>
      </section>

      <section className="recipes-results">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe._id} recipe={recipe} />
        ))}
      </section>
    </div>
  );
}

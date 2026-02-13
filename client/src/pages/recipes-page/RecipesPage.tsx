import './RecipesPage.css';

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../hooks/useAuth.ts';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

import { RecipeCard } from '../../components/recipe-card/RecipeCard';
import { useIngredients } from '../../hooks/useIngredients.ts';
import { getRecipes } from '../../services/recipes-service.ts';
import { getSessionKey } from '../../utilities/session-key.ts';
import { StatusPanel } from '../../components/status-panel/StatusPanel.tsx';
import { monthCapitalized } from '../../utilities/generate-month.ts';
import { getFavourites } from '../../services/favourites-service.ts';

import type { RecipeCardT } from '../../../../data/recipes/types/recipe-types'
import type { StatusT } from '../../types/status-types'


type Props = {
  mode: string
}

export function RecipesPage({mode}: Props) {
  const { ingredients, ingredientsStatus, ingredientsError } = useIngredients();
  const { auth, isInFavourites } = useAuth();
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

  const favouritesKey = useMemo(
    () => (auth?.favourites ? auth.favourites.map((recipe) => recipe._id).join('|') : ''),
    [auth?.favourites]
  )

  useEffect(() => {
    if (ingredientsStatus !== 'success' || !ingredients) return;

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 10000);

    (async function() {
      try {
        setRecipesStatus('loading');
        setRecipesError(null);

        const {
          recipes,
          totalCount,
          totalPages
        } = (mode === 'recipes')
          ? await getRecipes({ingredients, seed}, page, limit, controller.signal)
          : await getFavourites({ingredients}, page, limit, controller.signal)

        setRecipes(recipes);
        setTotalCount(totalCount);
        setTotalPages(totalPages);
        setRecipesStatus('success');
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;

        setRecipesStatus('error');
        setRecipesError(err instanceof Error? err.message : 'Unknown error')
      }
    })()
    
    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [mode, ingredientsKey, ingredientsStatus, seed, page, limit]);

  useEffect(() => {
    if (mode === 'recipes' || !auth) return;

    setRecipes((prev) => prev.filter((recipe) => isInFavourites(recipe._id)))

    const nextTotalPages = Math.max(1, Math.ceil(auth.favourites.length / limit));

    setTotalCount(auth.favourites.length);
    setTotalPages(nextTotalPages);
    setPage((p) => Math.min(p, nextTotalPages));
  }, [mode, favouritesKey, isInFavourites, limit]);

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
    <div className="recipes-page">
      <section className="recipes-page__description">
        <div className="description-header-blank"/>
        <h1 className="description-title">{ monthCapitalized}'S RECIPES</h1>
        <p className="description-subtitle">Showing {totalCount} recipes </p>
      </section>
      
      <section className="recipes-page__pagination">
        <div className="pagination__limit--blank" />
        <div className="pagination__nav">
          <button className="nav-button" type="button" onClick={() => setPage(1)} disabled={!canSelectPrevious}>
            <p className="nav-button-text">&lt;&lt; FIRST</p>
            <ChevronsLeft className="nav-button-icon" />
          </button>
          <button className="nav-button" type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={!canSelectPrevious}>
            <p className="nav-button-text">&lt; PREV</p>
            <ChevronLeft className="nav-button-icon" />
          </button>
          <span className="nav-info">
            Page <span>{page}</span> of {totalPages ?? 1}
          </span>
          <button className="nav-button" type="button" onClick={() => setPage((p) => p + 1)} disabled={!canSelectNext}>
            <p className="nav-button-text">NEXT &gt;</p>
            <ChevronRight className="nav-button-icon" />
          </button>
          <button className="nav-button" type="button" onClick={() => totalPages && setPage(totalPages)} disabled={!canSelectNext}>
            <p className="nav-button-text">LAST &gt;&gt;</p>
            <ChevronsRight className="nav-button-icon" />
          </button>
        </div>
        <div className="pagination__limit">
          <button className="limit-button" type="button" onClick={() => {setLimit(24); setPage(1);}} disabled={limit===24}>
            24
          </button>
          <button className="limit-button" type="button" onClick={() => {setLimit(48); setPage(1);}} disabled={limit===48}>
            48
          </button>
        </div>
      </section>

      <section className="recipes-page__results">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe._id} recipe={recipe} />
        ))}
      </section>
    </div>
  );
}

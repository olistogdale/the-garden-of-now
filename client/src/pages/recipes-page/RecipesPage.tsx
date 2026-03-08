import './RecipesPage.css';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.ts';

import { RecipeCard } from '../../components/recipe-card/RecipeCard';
import { useIngredients } from '../../hooks/useIngredients.ts';
import { getRecipes } from '../../services/recipes-service.ts';
import { getSessionKey } from '../../utilities/session-key.ts';
import { StatusPanel } from '../../components/status-panel/StatusPanel.tsx';
import { monthCapitalized } from '../../utilities/generate-month.ts';
import { getFavourites } from '../../services/favourites-service.ts';
import { PageNavigation } from '../../components/page-navigation/PageNavigation.tsx';
import { useStableLoading } from '../../hooks/useStableLoading.ts';
import { sanitizePage, sanitizeLimit } from '../../utilities/sanitizer.ts';

import type { RecipeCardT } from '../../../../data/recipes/types/recipe-types'
import type { StatusT } from '../../types/status-types'
import type { PaginationUpdateT } from '../../types/pagination-types.ts';

type Props = {
  mode: "recipes" | "favourites"
}

export function RecipesPage({mode}: Props) {
  const { ingredients, ingredientsStatus, ingredientsError } = useIngredients();
  const { auth, isInFavourites } = useAuth();
  const recipeSeed = getSessionKey();

  const [searchParams, setSearchParams] = useSearchParams();
  const page = sanitizePage(searchParams.get('page') ?? 1);
  const limit = sanitizeLimit(searchParams.get('limit') ?? 24);
  const [totalCount, setTotalCount] = useState <number | null> (null);
  const [totalPages, setTotalPages] = useState <number | null> (null);

  const [recipes, setRecipes] = useState <RecipeCardT[]> ([]);
  const [recipesStatus, setRecipesStatus] = useState <StatusT> ('idle');
  const [recipesError, setRecipesError] = useState <string | null> (null);
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  const seed = mode === 'recipes' ? recipeSeed : '';

  const setParams = useCallback(({page: pageNumber, limit: limitValue}: PaginationUpdateT, options?: { replace?: boolean }) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      let hasChanges = false;
      
      if (pageNumber !== undefined) {
        const currentPage = sanitizePage(next.get('page') ?? '1');
        const resolvedPage = typeof pageNumber === 'function' ? pageNumber(currentPage) : pageNumber;
        const normalizedPage = sanitizePage(resolvedPage);
        
        if (normalizedPage !== currentPage) {
          next.set('page', String(normalizedPage));
          hasChanges = true;
        }
      }

      if (limitValue !== undefined) {
        const currentLimit = sanitizeLimit(next.get('limit') ?? '24');
        const normalizedLimit = sanitizeLimit(limitValue);

        if (normalizedLimit !== currentLimit) {
          next.set('limit', String(normalizedLimit));
          hasChanges = true;
        }
      }
      
      if (!hasChanges) return prev;
      return next;
    }, { replace: options?.replace ?? false }) 
 
  }, [setSearchParams])

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
        if ((err instanceof DOMException || err instanceof Error) && err.name === 'AbortError') return;

        setRecipesStatus('error');
        setRecipesError(err instanceof Error? err.message : 'Unknown error')
      } finally {
        setPendingAction(null);
      }
    })()
    
    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [mode, ingredients, ingredientsStatus, seed, page, limit]);

  useEffect(() => {
    if (mode !== 'favourites') return;

    setRecipes((prev) => prev.filter((recipe) => isInFavourites(recipe._id)))

    const favouritesCount = auth?.favourites?.length ?? 0;
    
    const nextTotalPages = Math.max(1, Math.ceil(favouritesCount / limit));

    setTotalCount(favouritesCount);
    setTotalPages(nextTotalPages);

    setParams({ page: Math.min(page, nextTotalPages) }, { replace: true })
  }, [mode, auth?.favourites, isInFavourites, page, limit, setParams]);


  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [page]);



  const isPendingIngredients = ingredientsStatus === 'idle' || ingredientsStatus === 'loading'
  const showLoadingIngredients = useStableLoading(isPendingIngredients);

  const isPendingRecipes = (recipesStatus === 'idle' || recipesStatus === 'loading') && recipes.length === 0
  const showLoadingRecipes = useStableLoading(isPendingRecipes);

  if (ingredientsStatus === 'error') return <StatusPanel mode="error" message={`Couldn’t load seasonal ingredients${ingredientsError ? `: ${ingredientsError}` : '.'}`} />

  if (showLoadingIngredients) return <StatusPanel mode="loading" message="Loading ingredients…" />;
  
  if (recipesStatus === 'error' && recipes.length === 0) return <StatusPanel mode="error" message={`Couldn’t load recipes${recipesError ? `: ${recipesError}` : '.'}`} />

  if (showLoadingRecipes) return <StatusPanel mode="loading" message="Loading recipes…" />;

  return (
    <div className="recipes-page">
      <section className="recipes-page__description">
        <div className="description-header-blank"/>
        <h1 className="description-title">{ monthCapitalized}'S RECIPES</h1>
        <p className="description-subtitle">{totalCount === null ? "Loading recipes..." : `Showing ${totalCount} recipes`}</p>
      </section>
      
      <PageNavigation
        top={true}
        page={page}
        limit={limit}
        setParams={setParams}
        totalPages={totalPages}
        isLoading={recipesStatus === 'loading'}
        pendingAction={pendingAction}
        setPendingAction={setPendingAction}
      />

      <section className="recipes-page__results">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe._id} recipe={recipe} />
        ))}
      </section>

      <PageNavigation
        top={false}
        page={page}
        limit={limit}
        setParams={setParams}
        totalPages={totalPages}
        isLoading={recipesStatus === 'loading'}
        pendingAction={pendingAction}
        setPendingAction={setPendingAction}
      />
    </div>
  );
}

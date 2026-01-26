import {
  useState,
  useEffect,
  useMemo
} from 'react';

import { fetchIngredients } from '../services/ingredients-service';
import { IngredientsContext } from '../context/ingredients-context';

import type { StatusT } from '../types/status-types'

export function IngredientsProvider({ children }: { children: React.ReactNode }) {
  const [ingredients, setIngredients] = useState <string[] | null> (null);
  const [ingredientsStatus, setStatus] = useState <StatusT> ('idle');
  const [ingredientsError, setError] = useState <string | null> (null);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 10000);
    
    (async function() {
      setStatus('loading');
      setError(null);

      try {
        const data = await fetchIngredients(controller.signal);
        setIngredients(data.ingredients);
        setStatus('success');
      } catch (err) {
        setIngredients(null);
        setStatus('error');
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        clearTimeout(timeoutId);
      }
    })()

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    }
  }, []);

  const value = useMemo(
    () => ({ ingredients, ingredientsStatus, ingredientsError }),
    [ingredients, ingredientsStatus, ingredientsError]
  );

  return (
    <IngredientsContext.Provider value={value}>
      {children}
    </IngredientsContext.Provider>
  );
}
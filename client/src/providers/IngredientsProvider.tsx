import {
  useState,
  useCallback,
  useRef,
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

  // Prevent double-fetch in React 18 StrictMode dev (effects run twice)
  const startedRef = useRef(false);

  const load = useCallback(async () => {
    setStatus('loading');
    setError(null);

    try {
      const data = await fetchIngredients();
      setIngredients(data.ingredients);
      setStatus('success');
    } catch (err) {
      setIngredients(null);
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, []);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    void load();
  }, [load]);

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
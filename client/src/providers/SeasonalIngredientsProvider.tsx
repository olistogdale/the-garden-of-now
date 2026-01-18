import {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo
} from "react";

import { fetchAvailableIngredients } from "../services/ingredients-service";
import { AvailableIngredientsContext } from "../context/available-ingredients-context";

import type { Status } from "../context/available-ingredients-context"

export function AvailableIngredientsProvider({ children }: { children: React.ReactNode }) {
  const [month, setMonth] = useState <string | null> (null);
  const [availableIngredients, setAvailableIngredients] = useState <string[] | null> (null);
  const [status, setStatus] = useState <Status> ('idle');
  const [error, setError] = useState <string | null> (null);

  // Prevent double-fetch in React 18 StrictMode dev (effects run twice)
  const startedRef = useRef(false);

  const load = useCallback(async () => {
    setStatus('loading');
    setError(null);

    try {
      const data = await fetchAvailableIngredients();
      setMonth(data.month)
      setAvailableIngredients(data.availableIngredients);
      setStatus('success');
    } catch (err) {
      setMonth(null);
      setAvailableIngredients(null);
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
    () => ({ month, availableIngredients, status, error }),
    [month, availableIngredients, status, error]
  );

  return (
    <AvailableIngredientsContext.Provider value={value}>
      {children}
    </AvailableIngredientsContext.Provider>
  );
}
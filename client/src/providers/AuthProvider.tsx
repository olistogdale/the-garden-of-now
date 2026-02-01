import {
  useState,
  useEffect,
  useCallback,
  useMemo
} from 'react';

import { registerUser, loginUser, authUser, logoutUser } from '../services/auth-service';
import { AuthContext } from '../context/auth-context';

import type { StatusT } from '../types/status-types'
import type { UserRegistrationRequestT, UserLoginRequestT, UserAuthResponseT, RecipeEntryT } from '../../../data/users/types/user-types';
import type { UserAuthStateT } from '../types/auth-types';
import { postFavourite, deleteFavourite } from '../services/favourites-service';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState <UserAuthStateT | null> (null);
  const [authStatus, setAuthStatus] = useState <StatusT> ('idle');
  const [authError, setAuthError] = useState <string | null> (null);

  const register = useCallback(async (payload: UserRegistrationRequestT) => {
    setAuthStatus('loading');
    setAuthError(null);

    try {
      const { userId, email, firstName, lastName, favourites }: UserAuthResponseT = await registerUser(payload);

      setAuth({ userId, email, firstName, lastName, favourites });
      setAuthStatus('success');
    } catch (err) {
      setAuth(null);
      setAuthStatus('error');
      setAuthError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  }, []);

  const login = useCallback(async (payload: UserLoginRequestT) => {
    setAuthStatus('loading');
    setAuthError(null);

    try {
      const { userId, email, firstName, lastName, favourites }: UserAuthResponseT = await loginUser(payload);

      setAuth({ userId, email, firstName, lastName, favourites });
      setAuthStatus('success');
    } catch (err) {
      setAuth(null)
      setAuthStatus('error');
      setAuthError(err instanceof Error? err.message : 'Unknown error');
      throw err;
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 10000);

    (async function () {
      setAuthStatus('loading');
      setAuthError(null);

      try {
        const { userId, email, firstName, lastName, favourites }: UserAuthResponseT = await authUser(controller.signal);        

        setAuth({ userId, email, firstName, lastName, favourites });
        setAuthStatus('success');
      } catch (err) {
        const message = err instanceof Error ? err.message : '';
        setAuth(null);

        if (message.includes('401')) {
          setAuthStatus('success');
          setAuthError(null);
        } else if (err instanceof DOMException && err.name === 'AbortError') {
          setAuthStatus('error');
          setAuthError('Auth check timed out');
        } else {
          setAuthStatus('error');
          setAuthError(err instanceof Error ? err.message : 'Unknown error');
        }
      } finally {
        clearTimeout(timeoutId)
      }
    })();

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  const logout = useCallback(async () => {
    setAuthStatus('loading');
    setAuthError(null);

    try {
      await logoutUser();

      setAuth(null);
      setAuthStatus('success');
    } catch (err) {
      setAuth(null);
      setAuthStatus('error');
      setAuthError(err instanceof Error? err.message : 'Unknown error');
      throw err;
    }
  }, [])

  const favouriteIdsSet = useMemo(
    () => new Set(auth?.favourites?.map((favourite) => favourite._id) ?? []),
    [auth?.favourites]
  );

  const isInFavourites = useCallback(
    (recipeId: string) => favouriteIdsSet.has(recipeId),
    [favouriteIdsSet]
  );

  const toggleFavourite = useCallback(async (recipeId: string, recipeName: string) => {
    let prevFavourites: RecipeEntryT[] | null = null;
    let exists: boolean | null = null;
    
    setAuth((prev: UserAuthStateT | null) => {
      if (!prev) return prev;

      prevFavourites = prev.favourites.slice();
      exists = prev.favourites.some((recipe) => recipe._id === recipeId);

      return {
        ...prev,
        favourites: exists ?
          prev.favourites.filter((recipe: RecipeEntryT) => recipe._id !== recipeId) :
          [{ _id: recipeId, name: recipeName, addedAt: new Date()}, ...prev.favourites]
      };
    })

    if (exists === null) return;

    try {
      if (exists) await deleteFavourite({recipeId})
      else await postFavourite({recipeId, recipeName})
    } catch (err) {
      console.log('Error toggling favourite recipe:', err)
      setAuth((prev: UserAuthStateT | null) => {
        if (!prev || !prevFavourites) return prev
        return {...prev, favourites: prevFavourites}
      })
    }
   }, [] )
  
  
  const value = useMemo(
    () => ({ auth, authStatus, authError, register, login, logout, isInFavourites, toggleFavourite }),
    [auth, authStatus, authError, register, login, logout, isInFavourites, toggleFavourite]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
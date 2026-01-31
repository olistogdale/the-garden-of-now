import {
  useState,
  useEffect,
  useCallback,
  useMemo
} from 'react';

import { registerUser, loginUser, authUser, logoutUser } from '../services/auth-service';
import { AuthContext } from '../context/auth-context';

import type { StatusT } from '../types/status-types'
import type { UserRegistrationRequestT, UserLoginRequestT, UserAuthResponseT } from '../../../data/users/types/user-types';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState <UserAuthResponseT | null> (null);
  const [authStatus, setAuthStatus] = useState <StatusT> ('idle');
  const [authError, setAuthError] = useState <string | null> (null);

  const register = useCallback(async (payload: UserRegistrationRequestT) => {
    setAuthStatus('loading');
    setAuthError(null);

    try {
      const { userId, email, firstName, lastName }: UserAuthResponseT = await registerUser(payload);

      setAuth({ userId, email, firstName, lastName });
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
      const { userId, email, firstName, lastName }: UserAuthResponseT = await loginUser(payload);

      setAuth({ userId, email, firstName, lastName });
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
        const { userId, email, firstName, lastName }: UserAuthResponseT = await authUser(controller.signal);

        setAuth({ userId, email, firstName, lastName });
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

  const value = useMemo(
    () => ({ auth, authStatus, authError, register, login, logout }),
    [auth, authStatus, authError, register, login, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
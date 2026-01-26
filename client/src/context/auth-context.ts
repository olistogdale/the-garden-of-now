import { createContext } from 'react';

import type { AuthContextValueT } from '../types/auth-types'

export const AuthContext = createContext <AuthContextValueT | null> (null);
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { StatusPanel } from "../components/status-panel/StatusPanel";


export function RequireAuth () {
  const { auth, authStatus, authError } = useAuth();
  const location = useLocation();

  if (authStatus === 'idle' || authStatus === 'loading') {
    return <StatusPanel title="Authenticate" message="Authenticating user..."/>
  } else if (authStatus === 'error') {
    return <StatusPanel title="Authenticate" message={authError ?? "Can't reach server..."} />
  }

  return auth ? 
    <Outlet /> :
    <Navigate to="/login" replace state={{ from: location}}/>
} 
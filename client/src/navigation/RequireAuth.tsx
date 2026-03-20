import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';
import { StatusPanel } from '../components/status-panel/StatusPanel';
import { useStableLoading } from '../hooks/useStableLoading';

export function RequireAuth() {
  const { auth, authStatus, authError } = useAuth();
  const location = useLocation();

  const isPending = authStatus === 'idle' || authStatus === 'loading';
  const showLoading = useStableLoading(isPending);

  if (authStatus === 'error')
    return (
      <StatusPanel mode="error" message={authError ?? "Can't reach server."} />
    );

  if (showLoading)
    return <StatusPanel mode="loading" message="Authenticating user..." />;

  if (isPending) return null;

  return auth ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
}

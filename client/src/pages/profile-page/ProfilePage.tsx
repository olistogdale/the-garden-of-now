import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { StatusPanel } from '../../components/status-panel/StatusPanel';

import type { StatusT } from '../../types/status-types';
import { useStableLoading } from '../../hooks/useStableLoading';

export function ProfilePage () { 
  const navigate = useNavigate();
  const { logout, auth } = useAuth();

  const [logoutStatus, setLogoutStatus] = useState <StatusT> ('idle');
  const [logoutError, setLogoutError] = useState <string | null> (null) 

  const onLogout = async function () {
    try {
      setLogoutStatus('loading');
      setLogoutError(null);
      
      await logout()
      navigate('/', { replace: true });
    } catch (err) {
      setLogoutStatus('error');
      setLogoutError(err instanceof Error? err.message : 'Unknown error');
    }
  }

  const showLoading = useStableLoading(logoutStatus === "loading");
  
  if (logoutStatus === "error") return <StatusPanel mode = "error" message={`Could not log out ${logoutError ? `: ${logoutError}` : '.'}`} />;

  if (showLoading) return <StatusPanel mode="loading" message="Logging out of your account..." />;

  return (
    <div className="profile-page">
      <section className="profile-page__header">
        <h1 className="profile-page__title">Profile</h1>
        {auth ? (
          <p className="profile-page__subtitle">
            Signed in as <strong>{auth.email}</strong>
          </p>
        ) : null}
      </section>

      <section className="profile-page__actions">
        <button
          className="profile-page__button"
          type="button"
          onClick={onLogout}
          disabled={logoutStatus === "loading"}
        >
          Log out
        </button>

        <p className="profile-page__hint">
          Want recipes? <Link to="/recipes">Browse recipes</Link>
        </p>
      </section>
    </div>
  );
}
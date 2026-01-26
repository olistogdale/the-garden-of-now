import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { StatusPanel } from '../../components/status-panel/StatusPanel';

import type { StatusT } from '../../types/status-types';

export function ProfilePage () { 
  const navigate = useNavigate();
  const { logout, auth } = useAuth();

  const [logoutStatus, setLogoutStatus] = useState <StatusT> ('idle');
  const [logoutError, setLogoutError] = useState <string | null> (null) 

  const onLogout = async function () {
    try {
      setLogoutStatus('loading');
      setLogoutError('null');
      
      await logout()
      setLogoutStatus('success');
      navigate('/', { replace: true });
    } catch (err) {
      setLogoutStatus('error');
      setLogoutError(err instanceof Error? err.message : 'Unknown error');
    }
  }
  
  if (logoutStatus === 'loading') {
    return <StatusPanel title="Login" message="Logging out of your account..." />;
  }

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

      {logoutStatus === 'error' && logoutError ? (
        <div className="profile-page__error" role="alert">
          {logoutError}
        </div>
      ) : null}

      <section className="profile-page__actions">
        <button className="profile-page__button" type="button" onClick={onLogout}>
          Log out
        </button>

        <p className="profile-page__hint">
          Want recipes? <Link to="/recipes">Browse recipes</Link>
        </p>
      </section>
    </div>
  );
}
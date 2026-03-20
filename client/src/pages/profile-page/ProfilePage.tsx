import './ProfilePage.css';

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';
import { StatusPanel } from '../../components/status-panel/StatusPanel';
import { useStableLoading } from '../../hooks/useStableLoading';
import { Modal } from '../../components/modal/Modal';

import type { StatusT } from '../../types/status-types';

export function ProfilePage() {
  const navigate = useNavigate();
  const { logout, clearAuth, auth } = useAuth();

  const [logoutStatus, setLogoutStatus] = useState<StatusT>('idle');
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const [profileModal, setProfileModal] = useState<string | null>(null);

  const handleLogout = async function () {
    try {
      setLogoutStatus('loading');
      setLogoutError(null);

      await logout();
      navigate('/', { replace: true });
      window.setTimeout(() => {
        clearAuth();
      }, 0);
    } catch (err) {
      setLogoutStatus('error');
      setLogoutError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const closeModal = async function () {
    setProfileModal(null);
  };

  const launchChangePasswordModal = async function () {
    setProfileModal('password');
  };

  const launchDeleteUserModal = async function () {
    setProfileModal('delete-user');
  };

  const showLoading = useStableLoading(logoutStatus === 'loading');

  if (logoutStatus === 'error')
    return (
      <StatusPanel
        mode="error"
        message={`Could not log out ${logoutError ? `: ${logoutError}` : '.'}`}
      />
    );

  if (showLoading)
    return (
      <StatusPanel mode="loading" message="Logging out of your account..." />
    );

  return (
    <div className="profile">
      {profileModal === 'password' && (
        <Modal mode={'change-password'} closeModal={closeModal} />
      )}

      {profileModal === 'delete-user' && (
        <Modal mode={'delete-user'} closeModal={closeModal} />
      )}

      <section className="profile__user">
        <div className="user__header-blank" />
        <div className="user__dashboard">
          {auth ? (
            <div className="user__id">
              <p className="user__name">
                User:{' '}
                <strong>
                  {auth.firstName} {auth.lastName}
                </strong>
              </p>
              <p className="user__subtitle">
                Signed in as <strong>{auth.email}</strong>
              </p>
            </div>
          ) : null}

          <div className="user__controls">
            <button
              className="user__logout"
              type="button"
              onClick={handleLogout}
              disabled={logoutStatus === 'loading'}
            >
              LOG OUT
            </button>

            <button
              className="user__delete-user"
              type="button"
              onClick={launchDeleteUserModal}
            >
              DELETE USER
            </button>

            <button
              className="user__change-password"
              type="button"
              onClick={launchChangePasswordModal}
            >
              CHANGE PASSWORD
            </button>
          </div>
          <p className="user__hint">
            Looking for dinner-time inspiration? <br />
            <Link to="/recipes">Browse recipes</Link>
          </p>
        </div>
      </section>
    </div>
  );
}

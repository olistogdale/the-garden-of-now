import "./modal.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { changePassword } from "../../services/profile-service";
import { useAuth } from "../../hooks/useAuth";

import type { MouseEvent, SubmitEvent } from "react";
import type { StatusT } from "../../types/status-types";
import type { PasswordFormStateT } from "../../types/profile-types";

import { X } from "lucide-react";

type Props = {
  mode: string;
  closeModal: () => void;
};

export function Modal ({ mode, closeModal }: Props) {
  const { remove } = useAuth();
  const navigate = useNavigate();
  
  const [passwordForm, setPasswordForm] = useState<PasswordFormStateT>({currentPassword: '', newPassword: ''});
  const [passwordFormStatus, setPasswordFormStatus] = useState<StatusT>('idle');
  const [passwordFormError, setPasswordFormError] = useState<string | null>(null);

  const passwordFormIsInvalid = !passwordForm.currentPassword.length || !passwordForm.newPassword.length;
  const canSubmitPasswordForm = !passwordFormIsInvalid && !(passwordFormStatus === 'loading')

  const [confirmDeleteStatus, setConfirmDeleteStatus] = useState<StatusT>('idle');
  const [confirmDeleteError, setConfirmDeleteError] = useState<string | null>(null)

  const handleChangePassword = async function(event: SubmitEvent) {
    event.preventDefault();

    if (!canSubmitPasswordForm) return;
  
    const controller = new AbortController;
    const timeoutId = window.setTimeout(() => controller.abort(), 10000)
    
    try {
      setPasswordFormStatus('loading');
      setPasswordFormError(null);

      await changePassword({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword }, controller.signal);

      setPasswordFormStatus("success")
      closeModal();
    } catch (err) {
      if ((err instanceof DOMException || err instanceof Error) && err.name === 'AbortError') {
        setPasswordFormStatus('error');
        setPasswordFormError('Request timed out');  
        return;
      }

      setPasswordFormStatus('error');
      setPasswordFormError(err instanceof Error? err.message : 'Unknown error');
    } finally {
      clearTimeout(timeoutId);
    }
  }

  const handleDeleteUser = async function(event: MouseEvent) {
    event.preventDefault();
    
    try {
      setConfirmDeleteStatus('loading');
      setConfirmDeleteError(null);

      await remove();

      navigate('/', { replace: true });
    } catch (err) {
      setConfirmDeleteStatus('error');
      setConfirmDeleteError(err instanceof Error? err.message: 'Unknown error');
    }
  }

  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div className="modal-panel" onClick={(event) => event.stopPropagation()}>        
        <button className="modal-panel__exit-button" onClick={closeModal}>
          <X/>
        </button>
        {mode === 'change-password'
          ? <form className="password-form" onSubmit={handleChangePassword}>
              {passwordFormStatus === 'error' && passwordFormError ? (
                <div className="password-form__error" role="alert">
                  {passwordFormError}
                </div>
              ) : null}

              <label className="password-form__label">
                Current Password
                <input
                  className="password-form__input"
                  type="password"
                  autoComplete="current-password"
                  value={passwordForm.currentPassword}
                  onChange={(event) => setPasswordForm((form) => ({ ...form, currentPassword: event.target.value }))}
                  required
                />
              </label>

              <label className="password-form__label">
                New Password
                <input
                  className="password-form__input"
                  type="password"
                  autoComplete="new-password"
                  value={passwordForm.newPassword}
                  onChange={(event) => setPasswordForm((form) => ({ ...form, newPassword: event.target.value }))}
                  required
                />
              </label>

              <button
                className={`password-form__button ${passwordFormIsInvalid ? 'is-invalid' : passwordFormStatus === 'loading' ? 'is-loading' : ''}`}
                type="submit"
                disabled={passwordFormIsInvalid || passwordFormStatus === 'loading'}
                aria-busy={passwordFormStatus === 'loading'}
              >
                <span className="password-form__text">CHANGE PASSWORD</span>
                <span className="password-form__spinner" aria-hidden="true" />
              </button>
            </form>

          : <div className="confirm-delete">
              {confirmDeleteStatus === 'error' && confirmDeleteError
                ? (<div className="confirm-delete__error" role="alert">
                    {confirmDeleteError}
                  </div>)
                : null
              }

              <p className="confirm-delete__message">Are you sure you wish to delete your profile?</p>
              <button
                className={`confirm-delete__button ${confirmDeleteStatus === 'loading' ? 'is-loading' : ''}`}
                onClick={handleDeleteUser}
                type="submit"
                disabled={confirmDeleteStatus === 'loading'}
                aria-busy={confirmDeleteStatus === 'loading'}
              >
                <span className="confirm-delete__text">YES</span>
                <span className="confirm-delete__spinner" aria-hidden="true" />
              </button>
            </div>
        }
      </div>
    </div>
  )

}
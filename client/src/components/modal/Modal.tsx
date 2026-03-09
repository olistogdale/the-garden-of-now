import "./modal.css";

import { useState } from "react";

import { changePassword } from "../../services/profile-service";

import type { SubmitEvent } from "react";
import type { StatusT } from "../../types/status-types";
import type { PasswordFormStateT } from "../../types/profile-types";

import { X } from "lucide-react";

type Props = {
  handleModal: () => void;
};

export function Modal ({ handleModal }: Props) {
  const [form, setForm] = useState<PasswordFormStateT>({currentPassword: '', newPassword: ''});
  const [formStatus, setFormStatus] = useState<StatusT>('idle');
  const [formError, setFormError] = useState<string | null>(null);

  const isLoading = formStatus === 'loading';
  const isInvalid = !form.currentPassword.length || !form.newPassword.length;
  const canSubmitForm = !isInvalid && !isLoading;

  const handleChangePassword = async function (event: SubmitEvent) {
    event.preventDefault();

    if (!canSubmitForm) return;
  
    const controller = new AbortController;
    const timeoutId = window.setTimeout(() => controller.abort(), 10000)
    
    try {
      setFormStatus('loading');
      setFormError(null);

      await changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword }, controller.signal);

      setFormStatus("success")
      handleModal();
    } catch (err) {
      if ((err instanceof DOMException || err instanceof Error) && err.name === 'AbortError') return;

      setFormStatus('error');
      setFormError(err instanceof Error? err.message : 'Unknown error');
    }

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }

  return (
    <div className="modal-backdrop" onClick={handleModal}>
      <div className="modal-panel" onClick={(event) => event.stopPropagation()}>
        <button className="modal-panel__exit-button" onClick={handleModal}>
          <X/>
        </button>
        <form className="password-form" onSubmit={handleChangePassword}>
          {formStatus === 'error' && formError ? (
            <div className="password-form__error" role="alert">
              {formError}
            </div>
          ) : null}

          <label className="password-form__label">
            Current Password
            <input
              className="password-form__input"
              type="password"
              autoComplete="current-password"
              value={form.currentPassword}
              onChange={(event) => setForm((form) => ({ ...form, currentPassword: event.target.value }))}
              required
            />
          </label>

          <label className="password-form__label">
            New Password
            <input
              className="password-form__input"
              type="password"
              autoComplete="new-password"
              value={form.newPassword}
              onChange={(event) => setForm((form) => ({ ...form, newPassword: event.target.value }))}
              required
            />
          </label>

          <button
            className={`password-form__button ${isInvalid ? 'is-invalid' : isLoading ? 'is-loading' : ''}`}
            type="submit"
            disabled={isInvalid || isLoading}
            aria-busy={isLoading}
          >
            <span className="password-form__text">CHANGE PASSWORD</span>
            <span className="password-form__spinner" aria-hidden="true" />
          </button>
        </form>
      </div>
    </div>
  )
}
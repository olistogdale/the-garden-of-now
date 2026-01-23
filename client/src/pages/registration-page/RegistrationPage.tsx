import './RegistrationPage.css';

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { StatusPanel } from '../../components/status-panel/StatusPanel';
import { registerUser } from '../../services/auth-service';

import type { StatusT } from '../../types/status-types';
import type { RegistrationFormStateT } from '../../types/auth-types';

export function RegistrationPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState <RegistrationFormStateT> ({
    firstName: '',
    lastName: '',
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: ''
  })
  const [formStatus, setFormStatus] = useState <StatusT> ('idle');
  const [formError, setFormError] = useState <string | null> (null)

  const passwordsMatch = form.password.length > 0 && form.password === form.confirmPassword;
  const emailsMatch = form.email.length > 0 && form.email === form.confirmEmail

  const canSubmitForm = form.firstName.trim().length > 0 && form.lastName.trim().length > 0 && passwordsMatch && emailsMatch && formStatus !== 'loading';

  const onSubmit = async function (e: React.FormEvent) {
    e.preventDefault();

    if (!canSubmitForm) return;

    const controller = new AbortController()
    const timeoutId = window.setTimeout(() => controller.abort(), 10000)

    try {
      setFormStatus('loading');
      setFormError(null);

      const { _id, email } = await registerUser(
        {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password
        },
        controller.signal
      )

      // insert registration logic here
      navigate('/', { replace: true });
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        setFormStatus('error');
        setFormError('Request timed out. Please try again');
        return;
      }

      setFormStatus('error');
      setFormError(err instanceof Error? err.message : 'Unknown error')
    } finally {
      clearTimeout(timeoutId);
    }
  }

  if (formStatus === 'loading') {
    return <StatusPanel title="Login" message="Registering your account..." />;
  }

  return (
    <div className="auth-page">
      <header className="auth-page__header">
        <h1 className="auth-page__title">Create account</h1>
        <p className="auth-page__subtitle">Save favourites and access your profile.</p>
      </header>

      <form className="auth-form" onSubmit={onSubmit}>
        {formStatus === 'error' && formError ? (
          <div className="auth-form__error" role="alert">
            {formError}
          </div>
        ) : null}

        <label className="auth-form__label">
          First Name
          <input
            className="auth-form__input"
            type="text"
            autoComplete="given-name"
            value={form.firstName}
            onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
            required
          />
        </label>

        <label className="auth-form__label">
          Last Name
          <input
            className="auth-form__input"
            type="text"
            autoComplete="family-name"
            value={form.lastName}
            onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
            required
          />
        </label>

        <label className="auth-form__label">
          Email
          <input
            className="auth-form__input"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            required
          />
        </label>

        <label className="auth-form__label">
          Confirm Email
          <input
            className="auth-form__input"
            type="email"
            autoComplete="email"
            value={form.confirmEmail}
            onChange={(e) => setForm((f) => ({ ...f, confirmEmail: e.target.value }))}
            required
          />
        </label>

        {!emailsMatch && form.email.length > 0 ? (
          <div className="auth-form__hint" role="status">
            Emails don’t match.
          </div>
        ) : null}

        <label className="auth-form__label">
          Password
          <input
            className="auth-form__input"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            required
          />
        </label>

        <label className="auth-form__label">
          Confirm Password
          <input
            className="auth-form__input"
            type="password"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
            required
          />
        </label>

        {!passwordsMatch && form.confirmPassword.length > 0 ? (
          <div className="auth-form__hint" role="status">
            Passwords don’t match.
          </div>
        ) : null}

        <button className="auth-form__button" type="submit" disabled={!canSubmitForm}>
          Create account
        </button>

        <p className="auth-form__footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  )
};
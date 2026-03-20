import './AuthPage.css';

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';

import type { StatusT } from '../../types/status-types';
import type { RegistrationFormStateT } from '../../types/auth-types';
import type { FormEvent } from 'react';
import { BackgroundScroll } from '../../components/background-scroll/BackgroundScroll';
import { BackButton } from '../../components/back-button/BackButton';

export function RegistrationPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState<RegistrationFormStateT>({
    firstName: '',
    lastName: '',
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: '',
  });
  const [formStatus, setFormStatus] = useState<StatusT>('idle');
  const [formError, setFormError] = useState<string | null>(null);

  const passwordsMatch =
    form.password.length > 0 && form.password === form.confirmPassword;
  const emailsMatch = form.email.length > 0 && form.email === form.confirmEmail;

  const isLoading = formStatus === 'loading';
  const isInvalid =
    !form.firstName.trim().length ||
    !form.lastName.trim().length ||
    !form.email.trim().length ||
    !emailsMatch ||
    !form.password.length ||
    !passwordsMatch;
  const canSubmitForm = !isInvalid && !isLoading;

  const handleSubmit = async function (e: FormEvent) {
    e.preventDefault();

    if (!canSubmitForm) return;

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 10000);

    try {
      setFormStatus('loading');
      setFormError(null);

      await register(
        {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
        },
        controller.signal,
      );
      setFormStatus('success');
      navigate('/', { replace: true });
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        setFormStatus('error');
        setFormError('Request timed out. Please try again');
        return;
      }

      setFormStatus('error');
      setFormError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      clearTimeout(timeoutId);
    }
  };

  return (
    <div className="auth-page registration-page">
      <div className="auth-page__background">
        <BackgroundScroll />
      </div>

      <div className="back-button--page">
        <BackButton />
      </div>

      <section className="auth-page__form auth-page__form--registration">
        <div className="back-button--form">
          <BackButton />
        </div>

        <header className="auth-form__header">
          <h2 className="auth-form__title">CREATE ACCOUNT</h2>
          <p className="auth-form__subtitle">
            Save favourites and access your profile.
          </p>
        </header>

        <form className="auth-form" onSubmit={handleSubmit}>
          {formStatus === 'error' && formError ? (
            <div className="auth-form__error" role="alert">
              {formError}
            </div>
          ) : null}

          <fieldset className="auth-form__section">
            <label className="auth-form__label">
              First Name
              <input
                className="auth-form__input"
                type="text"
                autoComplete="given-name"
                value={form.firstName}
                onChange={(event) =>
                  setForm((form) => ({
                    ...form,
                    firstName: event.target.value,
                  }))
                }
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
                onChange={(event) =>
                  setForm((form) => ({ ...form, lastName: event.target.value }))
                }
                required
              />
            </label>
          </fieldset>

          <fieldset className="auth-form__section">
            <label className="auth-form__label">
              Email
              <input
                className="auth-form__input"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(event) =>
                  setForm((form) => ({ ...form, email: event.target.value }))
                }
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
                onChange={(event) =>
                  setForm((form) => ({
                    ...form,
                    confirmEmail: event.target.value,
                  }))
                }
                required
              />
            </label>
          </fieldset>

          {!emailsMatch && form.email.length > 0 ? (
            <div className="auth-form__hint" role="status">
              Emails don’t match.
            </div>
          ) : null}

          <fieldset className="auth-form__section">
            <label className="auth-form__label">
              Password
              <input
                className="auth-form__input"
                type="password"
                autoComplete="new-password"
                value={form.password}
                onChange={(event) =>
                  setForm((form) => ({ ...form, password: event.target.value }))
                }
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
                onChange={(event) =>
                  setForm((form) => ({
                    ...form,
                    confirmPassword: event.target.value,
                  }))
                }
                required
              />
            </label>
          </fieldset>

          {!passwordsMatch && form.confirmPassword.length > 0 ? (
            <div className="auth-form__hint" role="status">
              Passwords don’t match.
            </div>
          ) : null}

          <button
            className={`auth-form__button ${isInvalid ? 'is-invalid' : isLoading ? 'is-loading' : ''}`}
            type="submit"
            disabled={isInvalid || isLoading}
            aria-busy={isLoading}
          >
            CREATE ACCOUNT
          </button>

          <p className="auth-form__footer">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </form>
      </section>
    </div>
  );
}

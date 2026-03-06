import './AuthPage.css';

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

import { BackgroundScroll } from '../../components/background-scroll/BackgroundScroll';
import { BackButton } from '../../components/back-button/BackButton';

import type { LoginFormStateT } from '../../types/auth-types';
import type { StatusT } from '../../types/status-types';
import type { SubmitEvent } from 'react'

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState<LoginFormStateT>({email: '', password: ''});
  const [formStatus, setFormStatus] = useState<StatusT>('idle');
  const [formError, setFormError] = useState<string | null>(null);

  const isLoading = formStatus === 'loading';
  const isInvalid = !form.email.trim().length || !form.password.length;
  const canSubmitForm = !isInvalid && !isLoading;
  
  const handleLogin = async function(event: SubmitEvent) {
    event.preventDefault()

    if (!canSubmitForm) return;

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 10000)

    try {
      setFormStatus('loading');
      setFormError(null);

      await login({ email: form.email, password: form.password }, controller.signal);
      setFormStatus('success');
      navigate('/', { replace: true });
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        setFormStatus('error');
        setFormError('Request timed out. Please try again.');
        return;
      }

      setFormStatus('error');
      setFormError(err instanceof Error? err.message : 'Unknown error')
    } finally {
      clearTimeout(timeoutId);
    } 
  }
 
  return (
    <div className="auth-page login-page">
      <div className="auth-page__background">
         <BackgroundScroll />
      </div>

      <div className="back-button--page">
        <BackButton />
      </div>
      
      <div className="auth-page__form auth-page__form--login">
        <div className="back-button--form">
          <BackButton />
        </div>
        
        <section className="auth-form__header">
          <h2 className="auth-form__title">LOG IN</h2>
          <p className="auth-form__subtitle">Welcome back.</p>
        </section>

        <form className="auth-form" onSubmit={handleLogin}>
          {formStatus === 'error' && formError ? (
            <div className="auth-form__error" role="alert">
              {formError}
            </div>
          ) : null}

          <label className="auth-form__label">
            Email
            <input
              className="auth-form__input"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(event) => setForm((form) => ({ ...form, email: event.target.value }))}
              required
            />
          </label>

          <label className="auth-form__label">
            Password
            <input
              className="auth-form__input"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={(event) => setForm((form) => ({ ...form, password: event.target.value }))}
              required
            />
          </label>

          <button
            className={`auth-form__button ${isInvalid ? 'is-invalid' : isLoading ? 'is-loading' : ''}`}
            type="submit"
            disabled={isInvalid || isLoading}
            aria-busy={isLoading}
          >
            <span className="auth-form__text">LOG IN</span>
            <span className="auth-form__spinner" aria-hidden="true" />
          </button>

          <p className="auth-form__footer">
            Don’t have an account? <Link to="/register">Create one</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

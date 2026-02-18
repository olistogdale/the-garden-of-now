import './LoginPage.css';

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

import { StatusPanel } from '../../components/status-panel/StatusPanel';
import { BackgroundScroll } from '../../components/background-scroll/BackgroundScroll';

import type { LoginFormStateT } from '../../types/auth-types';
import type { StatusT } from '../../types/status-types';
import type { FormEvent } from 'react'

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState <LoginFormStateT> ({email: '', password: ''});
  const [formStatus, setFormStatus] = useState <StatusT> ('idle');
  const [formError, setFormError] = useState <string | null> (null);
  
  const canSubmitForm = form.email.trim().length > 0 && form.password.length > 0 && formStatus !== 'loading'
  
  const onSubmit = async function(e: FormEvent) {
    e.preventDefault()

    if (!canSubmitForm) return;

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 10000)

    try {
      setFormStatus('loading');
      setFormError(null);

      await login({ email: form.email, password: form.password });
      setFormStatus('success');
      navigate('/', { replace: true });
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
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

  if (formStatus === 'loading') {
    return <StatusPanel title="Login" message="Logging you in…" />;
  }
 
  return (
    <div className="auth-page">
      <BackgroundScroll />
      
      <div className="auth-page__form">
        <section className="auth-form__header">
          <h2 className="auth-form__title">LOG IN</h2>
          <p className="auth-form__subtitle">Welcome back.</p>
        </section>

        <form className="auth-form" onSubmit={onSubmit}>
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
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
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
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              required
            />
          </label>

          <button className="auth-form__button" type="submit" disabled={!canSubmitForm}>
            LOG IN
          </button>

          <p className="auth-form__footer">
            Don’t have an account? <Link to="/register">Create one</Link>
          </p>
        </form>

      </div>
    </div>
  )
}
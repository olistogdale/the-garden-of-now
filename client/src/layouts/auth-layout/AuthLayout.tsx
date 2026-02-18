import { Outlet } from 'react-router-dom';

import './AuthLayout.css'

export function AuthLayout() {
  return (
    <div className="auth-layout">
      <main className="auth-layout__main">
        <Outlet />
      </main>
    </div>
  )
}
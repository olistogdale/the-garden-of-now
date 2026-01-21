import { Outlet } from 'react-router-dom';

import './AuthLayout.css'

export function AuthLayout() {
  return (
    <div className="app-shell">
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}
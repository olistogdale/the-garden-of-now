import { Outlet } from 'react-router-dom';

import { NavBar } from '../../components/nav-bar/NavBar';

import './MainLayout.css'

export function MainLayout() {
  return (
    <div className="app-shell">
      <header className= "app-header">
        <NavBar />
      </header>
      <main className="app-main">
        <Outlet />
      </main>
      <footer>
        {/* insert component for footer here when ready*/}
      </footer>
    </div>
  )
}
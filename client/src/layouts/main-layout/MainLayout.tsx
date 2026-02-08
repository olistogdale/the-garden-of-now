import { Outlet } from 'react-router-dom';

import { NavBar } from '../../components/nav-bar/NavBar';

import './MainLayout.css'

export function MainLayout() {
  return (
    <div className="main-layout">
      <header className= "main-layout__header">
        <NavBar />
      </header>
      <main className="main-layout__main">
        <Outlet />
      </main>
      <footer className="main-layout__footer">
        {/* insert component for footer here when ready*/}
      </footer>
    </div>
  )
}
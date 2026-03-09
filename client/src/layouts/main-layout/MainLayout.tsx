import { Outlet } from 'react-router-dom';

import { NavBar } from '../../components/nav-bar/NavBar';
import { Footer } from '../../components/footer/Footer';

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
        <Footer />
      </footer>
    </div>
  )
}
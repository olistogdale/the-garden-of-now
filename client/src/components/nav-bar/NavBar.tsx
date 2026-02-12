import './NavBar.css';

import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { BackButton } from '../back-button/BackButton';
import { User, Star, KeyRound } from "lucide-react";

import type { NavLinkProps } from 'react-router-dom';

export function NavBar() {
  const { auth } = useAuth();
  const { pathname } = useLocation();

  const navLinkClassname: NavLinkProps['className'] = ({ isActive }) => (isActive ? 'navlink active' : 'navlink')

  return (
    <div className="navbar">        
      <nav className="navbar__navlinks--left" aria-label="Primary">
        {pathname === '/' ? (
          <div className="back-button-placeholder"/>
        ) : (
          <BackButton />
        )}
      </nav>
      
      <NavLink to="/" className="navbar__brand" aria-label="Home">GARDEN <br className="break"/>OF NOW</NavLink>

      {auth ? (
        <nav className="navbar__navlinks--right" aria-label="User">
          <NavLink to="/favourites" className={navLinkClassname} >
            <Star className="navlink-icon"/>
            <span className="navlink-text">FAVOURITES</span>
          </NavLink>
          <NavLink to="/profile" className={navLinkClassname} >
            <User className="navlink-icon"/>
            <span className="navlink-text">PROFILE</span>
          </NavLink>
        </nav>
      ) : (
        <nav className="navbar__navlinks--right" aria-label="User">
          <NavLink to="/login" className={navLinkClassname} >
            <KeyRound className="navlink-icon"/>
            <span className="navlink-text">LOGIN/REGISTER</span>
          </NavLink>
        </nav>
      )}
    </div>
  )
}
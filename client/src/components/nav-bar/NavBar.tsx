import './NavBar.css';

import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { BackButton } from '../back-button/BackButton';
import { User, Star, KeyRound } from "lucide-react";

import type { NavLinkProps } from 'react-router-dom';

export function NavBar() {
  const { auth } = useAuth();
  const { pathname } = useLocation();

  const navLinkClassname: NavLinkProps['className'] = ({ isActive }) => (isActive ? 'navbar__navlink active' : 'navbar__navlink')

  return (
    <div className="navbar">        
      <nav className="navbar__links-left" aria-label="Primary">
        {pathname === '/' ? (
          <div className="navbar__back-button-placeholder"/>
        ) : (
          <BackButton />
        )}
      </nav>
      
      <NavLink to="/" className="navbar__brand" aria-label="Home">GARDEN <br className="break"/>OF NOW</NavLink>

      {auth ? (
        <nav className="navbar__links-right" aria-label="User">
          <NavLink to="/favourites" className={navLinkClassname} >
            <Star className="navbar__navlink-icon"/>
            <span className="navbar__navlink-text">FAVOURITES</span>
          </NavLink>
          <NavLink to="/profile" className={navLinkClassname} >
            <User className="navbar__navlink-icon"/>
            <span className="navbar__navlink-text">PROFILE</span>
          </NavLink>
        </nav>
      ) : (
        <nav className="navbar__links-right" aria-label="User">
          <NavLink to="/login" className={navLinkClassname} >
            <KeyRound className="navbar__navlink-icon"/>
            <span className="navbar__navlink-text">LOGIN/REGISTER</span>
          </NavLink>
        </nav>
      )}
    </div>
  )

}
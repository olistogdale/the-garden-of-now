import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

import type { NavLinkProps } from 'react-router-dom';

import './Navbar.css';

export function NavBar() {
  const { auth } = useAuth();
  const navLinkClassname: NavLinkProps['className'] = ({ isActive }) => (isActive ? 'navlink active' : 'navlink') 

  return (
    <div className="navbar">
      <NavLink to="/" className="navbar-branding">
        The Garden of Now
      </NavLink>

      {auth ? 
        <nav className="navbar-links" aria-label="Primary">
          <NavLink
            to="/profile"
            className={navLinkClassname}
          >
            Profile
          </NavLink>
        </nav> 
        :
        <nav className="navbar-links" aria-label="Primary">
          <NavLink
            to="/login"
            className={navLinkClassname}
          >
            Login/Register
          </NavLink>
        </nav>
      }
    </div>
  )

}
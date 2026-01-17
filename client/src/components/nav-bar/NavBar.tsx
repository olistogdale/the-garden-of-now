import { NavLink } from 'react-router-dom';

import type { NavLinkProps } from 'react-router-dom';

import './Navbar.css';

export function NavBar() {
  const navLinkClassname: NavLinkProps['className'] = ({ isActive }) => (isActive ? 'navlink active' : 'navlink') 

  return (
    <div className="navbar-container">
      <NavLink to="/" className="navbar-branding">
        The Garden of Now
      </NavLink>

      <nav className="navbar-links" aria-label="Primary">
        <NavLink
          to="/login"
          className={navLinkClassname}
        >
          Login/Register
        </NavLink>
      </nav>
    </div>
  )

}
import './Footer.css';

import { NavLink } from "react-router-dom"

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <div className="footer">
      <div className="footer__container">
        <section className="footer__description">
          <div className="footer__details">
            <h3>GARDEN OF NOW</h3>
            <p>A recipe app for seasonal eating. Discover inspiring dishes made from locally-sourced ingredients.</p>
          </div>
          <div className="footer__copyright">
            <p>&copy; {year} Garden Of Now</p>
          </div>
        </section>
        <section className="footer__navigation">
          <h3>NAVIGATION</h3>
          <NavLink to="/register">Register</NavLink>
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/recipes">Recipes</NavLink>
          <NavLink to="/">Home</NavLink>
        </section>
        <section className="footer__media">
          <h3>CONNECT</h3>
          <a href="https://www.linkedin.com/in/olistogdale/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="https://github.com/olistogdale" target="_blank" rel="noopener noreferrer">Github</a>
          <a href="mailto:oli.stogdale@gmail.com?subject=The%20Garden%20of%20Now%20Support&body=Hi%20there%2C">Contact</a>
        </section>
      </div>
    </div>  
  )
}
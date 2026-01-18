import './LandingPage.css';

import { Link } from 'react-router-dom';



export function LandingPage() {
  return (
    <div className="landing-container">
      <section className="landing-hero">
        <h1 className="landing-title">Welcome to the Garden of Now</h1>
        <p className="landing-subtitle">
          Short on inspiration? Find mouth-watering recipes using only what’s in season right now.
        </p>

        <div className="landing-cta">
          <Link to="/recipes" className="btn btn-primary">
            Browse recipes
          </Link>
        </div>
      </section>

      <section className="landing-features">
        <div className="feature">
          <h2>Seasonality-first</h2>
          <p>Discover recipes made from whatever’s in season, month in, month out.</p>
        </div>

        <div className="feature">
          <h2>Fast discovery</h2>
          <p>Filter recipes by ease, nutrition, time-taken and cuisine.</p>
        </div>

        <div className="feature">
          <h2>Saved for later</h2>
          <p>Create a profile and save your favourite recipes to come back to later.</p>
        </div>
      </section>
    </div>
  );
}
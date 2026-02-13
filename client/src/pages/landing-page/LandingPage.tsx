import './LandingPage.css';

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FeatureOneImage from './../../assets/images/feature-1-img-previous.png';
import FeatureTwoImage from './../../assets/images/feature-2-img-previous.png';
import FeatureThreeImage from './../../assets/images/feature-3-img-previous.png';
import { BackgroundScroll } from '../../components/background-scroll/BackgroundScroll';
import { ScrollDownButton } from '../../components/scroll-down-button/ScrollDownButton';

export function LandingPage() {
  const navigate = useNavigate();
  const [isBrowsing, setIsBrowsing] = useState(false);
  const navTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (navTimeoutRef.current !== null) {
        window.clearTimeout(navTimeoutRef.current);
      }
    };
  }, []);

  function handleBrowseClick() {
    if (isBrowsing) return;
    setIsBrowsing(true);

    window.requestAnimationFrame(() => {
      navTimeoutRef.current = window.setTimeout(() => {
        navigate('/recipes');
      }, 100);
    });
  }

  return (
    <div className="landing">
      <section className="landing__hero">
        <div className="hero-header-blank"/>
        <div className="hero-content">
          <h1 className="hero-title">
            SHORT ON DINNER-TIME INSPIRATION?
          </h1>
          <h3 className="hero-subtitle">
            Create mouth-watering meals using only seasonal ingredients.
          </h3>
        </div>
        <div className="hero-image-blank"/>
        <div className="hero-cta">
          <button
            className={`hero-cta-button ${isBrowsing ? 'is-loading' : ''}`}
            type="button"
            onClick={handleBrowseClick}
            disabled={isBrowsing}
            aria-busy={isBrowsing}
          >
            <span className="hero-cta-text">BROWSE RECIPES</span>
            <span className="hero-cta-spinner" aria-hidden="true" />
          </button>
        </div>
        <ScrollDownButton targetId="features-page"/>
      </section>

      <section id="features-page" className="landing__features">
        <BackgroundScroll />

        <div className="landing__features-content">
          <div className="feature-header-blank"/>
          <div className="feature">
            <img className="feature__img" src={FeatureOneImage}/>
            <div className="feature__content">
              <h2>SEASONAL PICKS</h2>
              <p>Month-to-month, discover recipes made entirely from fresh, local ingredients.</p>
            </div>
          </div>

          <div className="feature">
            <img className="feature__img" src={FeatureTwoImage}/>
            <div className="feature__content">
              <h2>SAVED FOR LATER</h2>
              <p>Create a profile and save your favourite seasonal recipes to come back to.</p>
            </div>
          </div>

          <div className="feature">
            <p className="feature__coming-soon">COMING SOON!</p>
            <img className="feature__img" src={FeatureThreeImage}/>
            <div className="feature__content">
              <h2>FAST DISCOVERY</h2>
              <p>Filter recipes by ease, nutritional value, time-taken and type of cuisine.</p>
            </div>
          </div>

          <div className="feature-footer-blank">
            {/*<ScrollDownButton targetId="page"/>*/}
          </div>
        </div>
      </section>
    </div>
  );
}

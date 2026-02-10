import './LandingPage.css';

import { Link } from 'react-router-dom';
import FeatureOneImage from './../../assets/images/feature-1-img-previous.png';
import FeatureTwoImage from './../../assets/images/feature-2-img-previous.png';
import FeatureThreeImage from './../../assets/images/feature-3-img-previous.png';
import { BackgroundScroll } from '../../components/background-scroll/BackgroundScroll';
import { ScrollDownButton } from '../../components/scroll-down-button/ScrollDownButton';

export function LandingPage() {
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
          <Link to="/recipes" className="hero-cta-link">
            BROWSE RECIPES
          </Link>
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

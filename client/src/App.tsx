import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { MainLayout } from './layouts/main-layout/MainLayout';
import { LandingPage } from './pages/landing-page/LandingPage';
import { RecipesPage } from './pages/recipes-page/RecipesPage';
import { RecipeDetailPage } from './pages/recipe-detail-page/RecipeDetailPage';

import './App.css'

function App() {

  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/recipes" element={<RecipesPage />} />
          <Route path="/recipes/:id" element={<RecipeDetailPage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App

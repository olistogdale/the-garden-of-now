import './App.css'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { MainLayout } from './layouts/main-layout/MainLayout';
import { AuthLayout } from './layouts/auth-layout/AuthLayout';
import { LandingPage } from './pages/landing-page/LandingPage';
import { RecipesPage } from './pages/recipes-page/RecipesPage';
import { RecipeDetailPage } from './pages/recipe-detail-page/RecipeDetailPage';
import { LoginPage} from './pages/login-page/LoginPage';
import { RegistrationPage } from './pages/registration-page/RegistrationPage';
import { IngredientsProvider } from './providers/IngredientsProvider';

function App() {

  return (
    <Router>
      <Routes>
        <Route
          element={
            <IngredientsProvider>
              <MainLayout />
            </IngredientsProvider>
          }
        >
          <Route path="/" element={<LandingPage />} />
          <Route path="/recipes" element={<RecipesPage />} />
          <Route path="/recipes/:id" element={<RecipeDetailPage />} />
        </Route>
        <Route
          element={
            <IngredientsProvider>
              <AuthLayout />
            </IngredientsProvider>
          }
        >
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App

import './App.css'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { MainLayout } from './layouts/main-layout/MainLayout';
import { AuthLayout } from './layouts/auth-layout/AuthLayout';
import { LandingPage } from './pages/landing-page/LandingPage';
import { RecipesPage } from './pages/recipes-page/RecipesPage';
import { RecipeDetailPage } from './pages/recipe-detail-page/RecipeDetailPage';
import { LoginPage} from './pages/login-page/LoginPage';
import { RegistrationPage } from './pages/registration-page/RegistrationPage';
import { ProfilePage } from './pages/profile-page/ProfilePage';
import { IngredientsProvider } from './providers/IngredientsProvider';
import { AuthProvider } from './providers/AuthProvider';
import { RequireAuth } from './navigation/RequireAuth';


function App() {

  return (
    <Router>
      <AuthProvider>
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
            <Route element={<RequireAuth />}>
              <Route path="/profile" element={<ProfilePage />}/>
            </Route>
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
      </AuthProvider>
    </Router>
  )
}

export default App

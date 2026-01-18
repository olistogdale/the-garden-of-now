import './RecipesPage.css';

import { RecipeCard } from '../../components/recipe-card/RecipeCard';
import { useAvailableIngredients } from '../../hooks/useSeasonalIngredients';

import type { RecipeCardT } from '../../../../data/recipes/types/recipe-types'

const MOCK_RECIPES: RecipeCardT[] = [
  {
    _id: '1',
    name: 'Navarin of lamb & spring vegetables',
    image: [
      { url: 'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/recipe-image-legacy-id-221500_11-4e299a3.jpg?resize=440,400', width: 440, height: 400 },
      { url: 'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/recipe-image-legacy-id-221500_11-4e299a3.jpg?resize=960,872', width: 960, height: 872 },
    ],
    prepTime: '20 mins',
    cookTime: '1 hr 10 mins',
    skillLevel: 'Easy',
  },
  {
    _id: '2',
    name: 'Lemon herb roast chicken',
    image: [],
    totalTime: '1 hr 30 mins',
    skillLevel: 'Medium',
  },
];

export function RecipesPage() {
  const { month, availableIngredients } = useAvailableIngredients();
  console.log(month, availableIngredients);


  const recipes = MOCK_RECIPES;

  return (
    <div className="recipes-page-container">
      <section className="recipes-page__header">
        <h1 className="recipes-page__title">Recipes</h1>
        <p className="recipes-page__subtitle">See what’s cooking right now.</p>
      </section>

      <section className="recipes-results">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe._id} recipe={recipe} />
        ))}
      </section>
    </div>
  );
}
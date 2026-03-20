import type { UserAuthResponseT } from '../../../data/users/types/user-types';
import type {
  RecipeCardT,
  RecipeT,
} from '../../../data/recipes/types/recipe-types';

export function makeUser(
  overrides: Partial<UserAuthResponseT> = {},
): UserAuthResponseT {
  return {
    userId: 'bob-simmons-1',
    email: 'bob.simmons@email.com',
    firstName: 'Bob',
    lastName: 'Simmons',
    favourites: [],
    ...overrides,
  };
}

export function makeRecipeCard(
  overrides: Partial<RecipeCardT> = {},
): RecipeCardT {
  return {
    _id: 'irish_pork_1',
    name: 'Irish coddled pork with cider',
    image: [
      {
        url: 'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/recipe-image-legacy-id-9116_11-41d76aa.jpg?resize=440,400',
        width: 440,
        height: 400,
      },
    ],
    groupedIngredients: [['butter'], ['pork'], ['potato'], ['cider']],
    prepTime: 'PT35M',
    cookTime: 'PT1H5M',
    totalTime: 'PT2H10M',
    skillLevel: 'Easy',
    inSeason: true,
    ...overrides,
  };
}

export function makeAdditionalRecipeCard(
  overrides: Partial<RecipeCardT> = {},
): RecipeCardT {
  return {
    _id: 'gnocchi_squash_2',
    name: 'Gnocchi with roasted squash & goat’s cheese',
    image: [
      {
        url: 'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/recipe-image-legacy-id-9163_12-6d73646.jpg?resize=440,400',
        width: 440,
        height: 400,
      },
    ],
    groupedIngredients: [
      ['gnocchi'],
      ['spinach'],
      ["goat's cheese"],
      ['butternut squash'],
    ],
    cookTime: 'PT20M',
    totalTime: 'PT35M',
    skillLevel: 'Easy',
    inSeason: true,
    ...overrides,
  };
}

export function makeRecipe(overrides: Partial<RecipeT> = {}): RecipeT {
  return {
    _id: 'irish_pork_1',
    name: 'Irish coddled pork with cider',
    description:
      'Host your own St Patrick’s day party with this cider infused Irish stew, perfect with a side of colcannon and a pint of Guinness',
    image: [
      {
        url: 'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/recipe-image-legacy-id-9116_11-41d76aa.jpg?resize=440,400',
        width: 440,
        height: 400,
      },
    ],
    url: 'https://www.bbcgoodfood.com/recipes/irish-coddled-pork-cider',
    keywords:
      "800 kcal or less, Alcohol, Ireland, Irish, Mains, St Patrick's day, Stew",
    prepTime: 'PT35M',
    cookTime: 'PT1H5M',
    totalTime: 'PT2H10M',
    skillLevel: 'Easy',
    nutrition: {
      calories: '717 calories',
      fatContent: '44 grams fat',
      saturatedFatContent: '17 grams saturated fat',
      carbohydrateContent: '37 grams carbohydrates',
      sugarContent: '20 grams sugar',
      fiberContent: '12 grams fiber',
      proteinContent: '44 grams protein',
      sodiumContent: '2.59 milligram of sodium',
    },
    cuisine: 'Irish',
    yield: 'Serves 2',
    category: 'Dinner, Main course, Supper',
    ingredients: [
      {
        text: 'small knob butter',
        optional: false,
        ingredientOptions: [
          {
            quantity: 'small knob',
            description: '',
            ingredient: 'butter',
            rawIngredients: ['butter'],
            preparation: '',
          },
        ],
      },
      {
        text: '2 pork loin chops',
        optional: false,
        ingredientOptions: [
          {
            quantity: '2',
            description: '',
            ingredient: 'pork loin chops',
            rawIngredients: ['pork'],
            preparation: '',
          },
        ],
      },
      {
        text: '4 rashers smoked bacon cut into pieces',
        optional: false,
        ingredientOptions: [
          {
            quantity: '4 rashers',
            description: 'smoked',
            ingredient: 'bacon',
            rawIngredients: ['pork'],
            preparation: 'cut into pieces',
          },
        ],
      },
      {
        text: '2 potatoes cut into chunks',
        optional: false,
        ingredientOptions: [
          {
            quantity: '2',
            description: '',
            ingredient: 'potatoes',
            rawIngredients: ['potato'],
            preparation: 'cut into chunks',
          },
        ],
      },
      {
        text: '100ml irish cider',
        optional: false,
        ingredientOptions: [
          {
            quantity: '100ml',
            description: 'irish',
            ingredient: 'cider',
            rawIngredients: ['cider'],
            preparation: '',
          },
        ],
      },
    ],
    instructions: [
      {
        text: 'Heat the butter in a casserole dish until sizzling, then fry the pork for 2-3 mins on each side until browned. Remove from the pan.',
      },
      {
        text: 'Tip the bacon, carrot, potatoes and swede into the pan, then gently fry until slightly coloured. Stir in the cabbage, sit the chops back on top, add the bay leaf, then pour over the cider and stock. Cover the pan, then leave everything to gently simmer for 20 mins until the pork is cooked through and the vegetables are tender.',
      },
    ],
    groupedIngredients: [['butter'], ['pork'], ['potato'], ['cider']],
    ...overrides,
  };
}

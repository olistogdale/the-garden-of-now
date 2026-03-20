import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  mockAuthUser,
  mockGetIngredients,
  mockGetRecipes,
} from '../../test/mock-services';
import { renderApp } from '../../test/render-app';
import { makeRecipeCard, makeAdditionalRecipeCard } from '../../test/factories';
import type { ErrorWithStatusT } from '../../types/auth-types';

describe('recipes page', () => {
  it('should display seasonal recipes upon loading', async () => {
    mockGetIngredients.mockResolvedValue({
      ingredients: [
        'butter',
        'pork',
        'potato',
        'cider',
        'gnocchi',
        'spinach',
        "goat's cheese",
        'butternut squash',
      ],
    });

    const authErr = new Error('Unauthorized') as ErrorWithStatusT;
    authErr.status = 401;

    mockAuthUser.mockRejectedValue(authErr);

    mockGetRecipes.mockResolvedValue({
      recipes: [makeRecipeCard(), makeAdditionalRecipeCard()],
      totalCount: 2,
      totalPages: 1,
    });

    renderApp('/recipes');

    expect(await screen.findByText(/showing 2 recipes/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/irish coddled pork with cider/i),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/gnocchi with roasted squash/i),
    ).toBeInTheDocument();
    expect(mockGetIngredients).toHaveBeenCalledWith(expect.any(AbortSignal));
    expect(mockGetRecipes).toHaveBeenCalledWith(
      expect.objectContaining({
        ingredients: expect.arrayContaining([
          'butter',
          'pork',
          'potato',
          'cider',
          'gnocchi',
          'spinach',
          "goat's cheese",
          'butternut squash',
        ]),
        seed: expect.any(String),
      }),
      1,
      24,
      expect.any(AbortSignal),
    );
  });

  it('should display a status panel with an ingredients failure message if ingredients fail to load', async () => {
    const ingredientsError = new Error(
      'Ingredients failed to load.',
    ) as ErrorWithStatusT;
    ingredientsError.status = 400;

    mockGetIngredients.mockRejectedValue(ingredientsError);

    const authError = new Error('Unauthorized') as ErrorWithStatusT;
    authError.status = 401;

    mockAuthUser.mockRejectedValue(authError);

    renderApp('/recipes');

    expect(await screen.findByText(/well, this is/i)).toBeInTheDocument();
    expect(
      await screen.findByText(
        /couldn.t load seasonal ingredients: ingredients failed to load/i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/irish coddled pork with cider/i),
    ).not.toBeInTheDocument();
  });

  it('should display a status panel with a recipes failure message if recipes fail to load', async () => {
    mockGetIngredients.mockResolvedValue({
      ingredients: [
        'butter',
        'pork',
        'potato',
        'cider',
        'gnocchi',
        'spinach',
        "goat's cheese",
        'butternut squash',
      ],
    });

    const authError = new Error('Unauthorized') as ErrorWithStatusT;
    authError.status = 401;

    mockAuthUser.mockRejectedValue(authError);

    const recipesError = new Error(
      'Recipes failed to load',
    ) as ErrorWithStatusT;
    recipesError.status = 400;

    mockGetRecipes.mockRejectedValue(recipesError);

    renderApp('/recipes');

    expect(await screen.findByText(/well, this is/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/couldn.t load recipes: recipes failed to load/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/irish coddled pork with cider/),
    ).not.toBeInTheDocument();
  });

  it('should paginate recipes across multiple pages if the number of recipes loaded is greater than the limit', async () => {
    const user = userEvent.setup();

    mockGetIngredients.mockResolvedValue({
      ingredients: [
        'butter',
        'pork',
        'potato',
        'cider',
        'gnocchi',
        'spinach',
        "goat's cheese",
        'butternut squash',
      ],
    });

    const authErr = new Error('Unauthorized') as ErrorWithStatusT;
    authErr.status = 401;

    mockAuthUser.mockRejectedValue(authErr);

    mockGetRecipes
      .mockResolvedValueOnce({
        recipes: [makeRecipeCard()],
        totalCount: 30,
        totalPages: 2,
      })
      .mockResolvedValueOnce({
        recipes: [makeAdditionalRecipeCard()],
        totalCount: 30,
        totalPages: 2,
      });

    renderApp('/recipes');

    expect(await screen.findByText(/showing 30 recipes/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/irish coddled pork with cider/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/gnocchi with roasted squash & goat.s cheese/i),
    ).not.toBeInTheDocument();

    const buttons = screen.getAllByRole('button');
    const nextButton = buttons.find((button) =>
      button.textContent?.includes('NEXT'),
    );
    expect(nextButton).toBeDefined();
    await user.click(nextButton!);

    expect(await screen.findByText(/showing 30 recipes/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/gnocchi with roasted squash & goat.s cheese/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/irish coddled pork with cider/i),
    ).not.toBeInTheDocument();

    expect(mockGetRecipes).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        ingredients: expect.arrayContaining([
          'butter',
          'pork',
          'potato',
          'cider',
          'gnocchi',
          'spinach',
          "goat's cheese",
          'butternut squash',
        ]),
        seed: expect.any(String),
      }),
      1,
      24,
      expect.any(AbortSignal),
    );

    expect(mockGetRecipes).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        ingredients: expect.arrayContaining([
          'butter',
          'pork',
          'potato',
          'cider',
          'gnocchi',
          'spinach',
          "goat's cheese",
          'butternut squash',
        ]),
        seed: expect.any(String),
      }),
      2,
      24,
      expect.any(AbortSignal),
    );
  });
});

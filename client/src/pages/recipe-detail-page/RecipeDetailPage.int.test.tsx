import { describe, it, expect } from "vitest";
import { screen, waitFor } from "@testing-library/react";

import { mockGetIngredients, mockAuthUser, mockGetRecipeByID } from "../../test/mock-services";
import { renderApp } from "../../test/render-app";

import type { ErrorWithStatusT } from "../../types/auth-types";
import { makeRecipe } from "../../test/factories";

describe("recipe detail page", () => {
  it("should display a seasonal recipe upon loading", async () => {
    mockGetIngredients.mockResolvedValue({
      ingredients: ["butter", "pork", "potato", "cider", "gnocchi", "spinach", "goat's cheese", "butternut squash"]
    })

    const authErr = new Error("Unauthorized") as ErrorWithStatusT;
    authErr.status = 401;

    mockAuthUser.mockRejectedValue(authErr);

    mockGetRecipeByID.mockResolvedValue({
      recipe: makeRecipe()
    })

    renderApp("/recipes/irish_pork_1");

    await waitFor(() => {
      expect(screen.getByText(/irish coddled pork with cider/i)).toBeInTheDocument();
      expect(screen.getByText(/host your own st patrick.s day party/i)).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: /ingredients/i })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: /instructions/i })).toBeInTheDocument();
      expect(mockGetIngredients).toHaveBeenCalledWith(expect.any(AbortSignal));
      expect(mockGetRecipeByID).toHaveBeenCalledWith("irish_pork_1", expect.any(AbortSignal));
    })
  })

  it("should display a status panel with a recipe failure message if recipe fails to load", async () => {
    mockGetIngredients.mockRejectedValue({
      ingredients: ["butter", "pork", "potato", "cider", "gnocchi", "spinach", "goat's cheese", "butternut squash"]
    });

    const authErr = new Error("Unauthorized") as ErrorWithStatusT;
    authErr.status = 401;

    mockAuthUser.mockRejectedValue(authErr);

    const recipeErr = new Error("Recipe failed to load.") as ErrorWithStatusT;
    recipeErr.status = 400;

    mockGetRecipeByID.mockRejectedValue(recipeErr);

    renderApp("/recipes/irish_pork_1");

    expect(await screen.findByText(/well, this is/i)).toBeInTheDocument();
    expect(await screen.findByText(/couldn.t load recipe: recipe failed to load/i)).toBeInTheDocument();
    expect(screen.queryByText(/irish coddled pork with cider/i)).not.toBeInTheDocument();
  })
})
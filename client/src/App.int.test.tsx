import { describe, it, expect } from "vitest";
import { screen, waitFor } from "@testing-library/react";

import { mockAuthUser, mockGetIngredients } from "./test/mock-services";
import { renderApp } from './test/render-app';

import type { ErrorWithStatusT } from "./types/auth-types";

describe("protected routes", () => {
  it("allows authenticated users to access /profile", async () => {
    mockAuthUser.mockResolvedValue({
      userId: "bob-simmons-1",
      email: "bob.simmons@email.com",
      firstName: "Bob",
      lastName: "Simmons",
      favourites: []
    });

    mockGetIngredients.mockResolvedValue({
      ingredients: ["carrot", "leek"]
    });

    renderApp('/profile');

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /log out/i })).toBeInTheDocument();
      expect(screen.getByText(/bob simmons/i)).toBeInTheDocument();
    })
  })
  
  it("redirects unauthenticated users from /profile to /login", async () => {
    const err = new Error("unauthorized") as ErrorWithStatusT;
    err.status = 401;
    
    mockAuthUser.mockRejectedValue(err);

    mockGetIngredients.mockResolvedValue({
      ingredients: ["carrot", "leek"],
    });

    renderApp('/profile');

    expect(await screen.findByRole("heading", { name: /log in/i })).toBeInTheDocument();
    expect(await screen.findByText(/welcome back/i)).toBeInTheDocument();
  })

  it("redirects unauthenticated users from /favourites to /login", async () => {
    const error = new Error("unauthorized") as ErrorWithStatusT;
    error.status = 401;

    mockAuthUser.mockRejectedValue(error);

    mockGetIngredients.mockResolvedValue({
      ingredients: ["carrott", "leek"]
    })

    renderApp('/favourites');

    expect(await screen.findByRole("heading", { name: /log in/i })).toBeInTheDocument();
    expect(await screen.findByText(/welcome back/i)).toBeInTheDocument();
  })
})

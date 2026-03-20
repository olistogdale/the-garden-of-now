import { describe, it, expect } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { mockGetIngredients, mockAuthUser, mockLogoutUser, mockDeleteUser, mockPatchPassword } from "../../test/mock-services";
import { renderApp } from "../../test/render-app";

import type { ErrorWithStatusT } from "../../types/auth-types";

describe("profile page", () => {
  it("allows authenticated users to access the page", async () => {
    mockGetIngredients.mockResolvedValue({
      ingredients: ["butter", "pork", "potato", "cider", "gnocchi", "spinach", "goat's cheese", "butternut squash"]
    })

    mockAuthUser.mockResolvedValue({
      userId: "bob-simmons-1",
      email: "bob.simmons@email.com",
      firstName: "Bob",
      lastName: "Simmons",
      favourites: []
    })

    renderApp('/profile');

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /log out/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /change password/i})).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /delete user/i})).toBeInTheDocument();
      expect(screen.getByText(/bob simmons/i)).toBeInTheDocument();
      expect(screen.getByText(/bob\.simmons@email\.com/i)).toBeInTheDocument();
    })
  })

  it("logs out authenticated users and redirects them to home", async () => {
    const user = userEvent.setup();
    
    mockGetIngredients.mockResolvedValue({
      ingredients: ["butter", "pork", "potato", "cider", "gnocchi", "spinach", "goat's cheese", "butternut squash"]
    })

    mockAuthUser.mockResolvedValue({
      userId: "bob-simmons-1",
      email: "bob.simmons@email.com",
      firstName: "Bob",
      lastName: "Simmons",
      favourites: []
    });

    mockLogoutUser.mockResolvedValue()

    renderApp("/profile");

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /log out/i })).toBeInTheDocument();
      expect(screen.getByText(/bob simmons/i)).toBeInTheDocument();
      expect(screen.getByText(/bob\.simmons@email\.com/i)).toBeInTheDocument();      
    })

    await user.click(await screen.findByRole("button", { name: /log out/i }));

    expect(mockLogoutUser).toHaveBeenCalled();

    expect(await screen.findByText(/short on dinner-time inspiration/i)).toBeInTheDocument();
    expect(await screen.findByRole("button", { name: /browse recipes/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /log out/i })).not.toBeInTheDocument();
  })
})
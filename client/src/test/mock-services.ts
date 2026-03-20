import { vi } from "vitest";

import { loginUser, registerUser, authUser, logoutUser, deleteUser } from "../services/auth-service";
import { getFavourites, postFavourite, deleteFavourite } from "../services/favourites-service";
import { getIngredients } from "../services/ingredients-service";
import { patchPassword } from "../services/profile-service";
import { getRecipes, getRecipeByID } from "../services/recipes-service";


vi.mock('../services/auth-service');
vi.mock('../services/favourites-service');
vi.mock('../services/ingredients-service');
vi.mock('../services/profile-service');
vi.mock('../services/recipes-service');

export const mockLoginUser = vi.mocked(loginUser);
export const mockRegisterUser = vi.mocked(registerUser);
export const mockAuthUser = vi.mocked(authUser);
export const mockLogoutUser = vi.mocked(logoutUser);
export const mockDeleteUser = vi.mocked(deleteUser);

export const mockGetFavourites = vi.mocked(getFavourites);
export const mockPostFavourite = vi.mocked(postFavourite);
export const mockDeleteFavourite = vi.mocked(deleteFavourite);

export const mockGetIngredients = vi.mocked(getIngredients)

export const mockPatchPassword = vi.mocked(patchPassword);

export const mockGetRecipes = vi.mocked(getRecipes);
export const mockGetRecipeByID = vi.mocked(getRecipeByID);

import type { StatusT } from "./status-types";
import type { RecipeEntryT, UserLoginRequestT, UserRegistrationRequestT } from "../../../data/users/types/user-types";

export type LoginFormStateT = {
  email: string,
  password: string
};

export type RegistrationFormStateT = {
  firstName: string,
  lastName: string,
  email: string,
  confirmEmail: string,
  password: string,
  confirmPassword: string
}

export type UserAuthStateT = {
  userId: string,
  email: string
  firstName: string,
  lastName: string,
  favourites: RecipeEntryT[]
}

export type AuthContextValueT = {
  auth: UserAuthStateT | null,
  authStatus: StatusT,
  authError: string | null,
  register: (payload: UserRegistrationRequestT) => Promise <void>,
  login: (payload: UserLoginRequestT) => Promise <void>,
  logout: () => Promise <void>,
  isInFavourites: (recipeId: string) => boolean,
  toggleFavourite: (recipeId: string, recipeName: string) => Promise <void> 
}
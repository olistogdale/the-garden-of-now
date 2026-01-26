import type { StatusT } from "./status-types";
import type { UserAuthResponseT, UserLoginRequestT, UserRegistrationRequestT } from "../../../data/users/types/user-types";

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

export type AuthContextValueT = {
  auth: UserAuthResponseT | null,
  authStatus: StatusT,
  authError: string | null,
  register: (payload: UserRegistrationRequestT) => Promise <void>,
  login: (payload: UserLoginRequestT) => Promise <void>,
  logout: () => Promise <void>,
}
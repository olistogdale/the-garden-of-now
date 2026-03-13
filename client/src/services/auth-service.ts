import { API_URL } from '../config'

import { fetchRequest } from '../utilities/fetch-request';

import type { UserRegistrationRequestT, UserLoginRequestT, UserAuthResponseT } from '../../../data/users/types/user-types'

export function registerUser(
  { firstName, lastName, email, password }: UserRegistrationRequestT,
  signal: AbortSignal
): Promise <UserAuthResponseT> {
  const url = `${API_URL}/register`;

  return fetchRequest(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ firstName, lastName, email, password }),
    signal
  })
}

export function loginUser(
  { email, password }: UserLoginRequestT,
  signal: AbortSignal
): Promise <UserAuthResponseT> {
  const url = `${API_URL}/login`;

  return fetchRequest(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password }),
    signal
  })
}

export  function authUser(signal: AbortSignal): Promise <UserAuthResponseT> {
  const url = `${API_URL}/auth`;

  return fetchRequest(url, {
    method: 'GET',
    signal
  })
}

export function logoutUser(): Promise <void> {
  const url = `${API_URL}/logout`;

  return fetchRequest(url, {
    method: 'POST'
  })
}

export function deleteUser(): Promise <void> {
  const url = `${API_URL}/delete`;

  return fetchRequest(url, {
    method: 'DELETE'
  })
}
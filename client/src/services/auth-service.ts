import { API_URL } from '../config'

import { fetchRequest } from '../utilities/fetch-request';

import type { UserRegistrationRequestT, UserLoginRequestT, UserAuthResponseT } from '../../../data/users/types/user-types'

export async function registerUser(
  { firstName, lastName, email, password }: UserRegistrationRequestT,
  signal?: AbortSignal 
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

export async function loginUser(
  { email, password }: UserLoginRequestT,
  signal?: AbortSignal
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

export async function authUser(signal?: AbortSignal): Promise <UserAuthResponseT> {
  const url = `${API_URL}/auth`;

  return fetchRequest(url, {
    method: 'GET',
    signal
  })
}

export async function logoutUser(signal?: AbortSignal): Promise <void> {
  const url = `${API_URL}/logout`;

  return fetchRequest(url, {
    method: 'POST',
    signal
  })
}
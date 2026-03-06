import { API_URL } from '../config'

import { fetchRequest } from '../utilities/fetch-request';

import type { UserPasswordRequestT } from '../types/profile-types';

export function changePassword(
  { currentPassword, newPassword }: UserPasswordRequestT,
  signal: AbortSignal
): Promise <void> {
  const url = `${API_URL}/me/password`;

  return fetchRequest(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({currentPassword, newPassword}),
    signal
  })
}
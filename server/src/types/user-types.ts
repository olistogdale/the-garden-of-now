import type { NameT } from '../../../data/users/types/user-types'

export type CreateUserT = {
  name: NameT,
  email: string,
  passwordHash: string,
  lastLoginAt: Date,
}
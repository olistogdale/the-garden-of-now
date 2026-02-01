'use strict';

import bcrypt from 'bcryptjs'

import { userModel } from '../../models/user-model';
import { signAccessToken } from '../../utilities/jwt-utils';
import { normalize } from '../../utilities/string-utils';

import type { Context } from 'koa';
import type { UserAuthResponseT, UserRegistrationRequestT } from '../../../../data/users/types/user-types';

export const registerUser = async function(ctx: Context) {
  const { firstName, lastName, email, password } = ctx.request.body as UserRegistrationRequestT;

  if (typeof firstName !== 'string' || !firstName.trim() || typeof lastName !== 'string' || !lastName.trim() || typeof email !== 'string' || !email.trim()) {
    ctx.status = 400;
    ctx.body = { error: 'Invalid registration credentials. Please provide a first name, last name and email.'};
    return;
  }

  if (typeof password !== 'string' || password !== password.trim() || password.length < 8) {
    ctx.status = 400;
    ctx.body = { error: 'Invalid password. Passwords must be at least 8 characters in length and may not begin or end with a space.'};
    return;
  }

  const cleanFirstName = firstName.trim();
  const cleanLastName = lastName.trim();
  const normalizedEmail = normalize(email);

  try {
    const exists = await userModel.exists({ email: normalizedEmail});

    if (exists) {
      ctx.status = 409;
      ctx.body = { error: 'A user already exists with this e-mail address. Please provide a different address.'};
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({
      name: { first: cleanFirstName, last: cleanLastName },
      email: normalizedEmail,
      passwordHash,
      lastLoginAt: new Date()
    });
    const token = signAccessToken(newUser._id.toString());

    ctx.cookies.set("accessToken", token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/'
    });
    ctx.status = 201;
    const body: UserAuthResponseT = {
      userId: newUser._id.toString(),
      email: newUser.email,
      firstName: newUser.name.first,
      lastName: newUser.name.last,
      favourites: newUser.favouriteRecipes
    };
    ctx.body = body;
  } catch (err) {
    console.log('Error registering new user:', err);
    ctx.status = 500;
    ctx.body = { error: 'Internal server error. Could not register a new user.'};
  }
}
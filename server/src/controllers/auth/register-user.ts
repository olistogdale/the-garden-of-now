'use strict';

import bcrypt from 'bcryptjs'

import { userModel } from '../../models/user-model';
import { signAccessToken } from '../../utilities/jwt-utils';

import type { Context } from 'koa';
import type { UserAuthResponseT, UserRegistrationRequestT, UserT } from '../../../../data/users/types/user-types';
import type { CreateUserT } from '../../types/user-types';

export const registerUser = async function(ctx: Context) {
  const { firstName, lastName, email, password } = ctx.request.body as UserRegistrationRequestT;

  if (!firstName || !lastName || !email || !password) {
    ctx.status = 400;
    ctx.body = { error: 'Invalid registration credentials. Please provide a first and last name, a valid email address and password.'};
    return;
  }

  if (password.length < 8) {
    ctx.status = 400;
    ctx.body = { error: 'Invalid password. Passwords must be at least 8 characters in length'};
    return;
  }

  try {
    const existingUser = await userModel.findOne < UserT> ({ email: email.toLowerCase()});

    if (existingUser) {
      ctx.status = 409;
      ctx.body = { error: 'A user already exists with this e-mail address. Please provide a different address.'};
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await userModel.create <CreateUserT> ({ name: { first: firstName, last: lastName }, email: email.toLowerCase(), passwordHash, lastLoginAt: new Date()})
    const token = signAccessToken(newUser._id.toString());

    ctx.cookies.set("accessToken", token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/'
    });
    ctx.status = 201;
    ctx.body = { _id: newUser._id, email: newUser.email, firstName: newUser.name.first, lastName: newUser.name.last } as UserAuthResponseT;
  } catch (err) {
    console.log('Error registering new user:', err);
    ctx.status = 500;
    ctx.body = { error: 'Internal server error. Could not register a new user.'};
  }
}
import { expect, it, describe, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import bcrypt from 'bcryptjs';

import { createApp } from '../../../app';
import { connectDB, disconnectDB } from '../../../database/db';
import { userModel } from '../../../models/user-model';
import { extractAccessToken } from '../../../utilities/test-utils';

let mongo: MongoMemoryServer;

describe('POST /login', () => {
  beforeAll(async () => {
    mongo = await MongoMemoryServer.create({
      binary: { version: '6.0.15' },
    });
    await connectDB(mongo.getUri());
  });

  afterAll(async () => {
    await disconnectDB();
    mongo && (await mongo.stop());
  });

  beforeEach(async () => {
    await userModel.deleteMany({});
  });

  async function expectError(
    app: any,
    body: any,
    errorCode: number,
    error: string,
  ) {
    const res = await request(app).post(`/login`).send(body);
    const accessToken = extractAccessToken(res);
    expect(res.status).toBe(errorCode);
    expect(res.body.error).toBe(error);
    expect(accessToken).toBeUndefined();
  }

  const mockLoginInfo = {
    email: 'bob.simmons@email.com',
    password: 'TheGardenOfNow',
  };

  it('sets an access token in cookies and returns user details upon valid user login input (200)', async () => {
    const hashedPassword = await bcrypt.hash('TheGardenOfNow', 10);

    await userModel.create({
      name: {
        first: 'Bob',
        last: 'Simmons',
      },
      email: 'bob.simmons@email.com',
      emailVerified: true,
      passwordHash: hashedPassword,
      favouriteRecipes: [],
      role: 'user',
      lastLoginAt: new Date(),
    });

    const app = createApp().callback();

    const res = await request(app).post('/login').send(mockLoginInfo);

    const accessToken = extractAccessToken(res);

    expect(res.status).toBe(200);
    expect(typeof res.body.userId).toBe('string');
    expect(res.body.email).toBe('bob.simmons@email.com');
    expect(res.body.firstName).toBe('Bob');
    expect(res.body.lastName).toBe('Simmons');
    expect(Array.isArray(res.body.favourites)).toBe(true);

    expect(accessToken).toBeTruthy();
    expect(/HttpOnly/i.test(accessToken)).toBe(true);
  });

  it('throws an error for invalid email or password input (400)', async () => {
    const app = createApp().callback();

    const errorReturned =
      'Invalid login credentials. Please provide a valid email and password.';

    await expectError(app, { ...mockLoginInfo, email: 1 }, 400, errorReturned);
    await expectError(
      app,
      { ...mockLoginInfo, email: '   ' },
      400,
      errorReturned,
    );
    await expectError(
      app,
      { ...mockLoginInfo, password: 1 },
      400,
      errorReturned,
    );
    await expectError(
      app,
      { ...mockLoginInfo, password: '' },
      400,
      errorReturned,
    );
    await expectError(
      app,
      { ...mockLoginInfo, password: '  TheGardenOfNow ' },
      400,
      errorReturned,
    );
  });

  it('throws an error for incorrect email or password input (401)', async () => {
    const hashedPassword = await bcrypt.hash('TheGardenOfNow', 10);

    await userModel.create({
      name: {
        first: 'Bob',
        last: 'Simmons',
      },
      email: 'bob.simmons@email.com',
      emailVerified: true,
      passwordHash: hashedPassword,
      favouriteRecipes: [],
      role: 'user',
      lastLoginAt: new Date(),
    });

    const app = createApp().callback();

    const errorReturned =
      'Invalid login credentials. Please provide a valid email and password.';

    await expectError(
      app,
      { ...mockLoginInfo, email: 'jen.smith@email.com' },
      401,
      errorReturned,
    );
    await expectError(
      app,
      { ...mockLoginInfo, password: 'TheGardenOfThen' },
      401,
      errorReturned,
    );
  });
});

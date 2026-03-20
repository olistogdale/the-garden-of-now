import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { createApp } from '../../../app';
import { connectDB, disconnectDB } from '../../../database/db';
import { userModel } from '../../../models/user-model';
import {
  makeRecipe,
  extractAccessToken,
  createAccessToken,
} from '../../../utilities/test-utils';

let mongo: MongoMemoryServer;

describe('POST /favourite', () => {
  beforeAll(async () => {
    mongo = await MongoMemoryServer.create({
      binary: { version: '6.0.15' },
    });
    await connectDB(mongo.getUri());
  });

  afterAll(async () => {
    await disconnectDB();
    await mongo.stop();
  });

  beforeEach(async () => {
    await userModel.deleteMany({});
  });

  async function expectError(
    app: any,
    body: any,
    errorCode: number,
    error: string,
    cookie: string,
  ) {
    const res = await request(app)
      .post(`/favourite`)
      .send(body)
      .set('Cookie', cookie);

    expect(res.status).toBe(errorCode);
    expect(res.body.error).toBe(error);
  }

  function roundToNearestSecond(value: string) {
    const date = new Date(value);
    return new Date(Math.ceil(date.getTime() / 1000) * 1000).toISOString();
  }

  const mockLoginInfo = {
    email: 'bob.simmons@email.com',
    password: 'TheGardenOfNow',
  };

  it('creates a new favourite recipe and returns favourite details (201)', async () => {
    const app = createApp().callback();

    const accessToken = await createAccessToken(app);

    const res = await request(app)
      .post('/favourite')
      .send({
        recipeId: 'irish_pork_1',
        recipeName: 'Irish coddled pork with cider',
      })
      .set('Cookie', accessToken);

    expect(res.status).toBe(201);
    expect(res.body.recipeId).toBe('irish_pork_1');
    expect(res.body.recipeName).toBe('Irish coddled pork with cider');
    expect(roundToNearestSecond(res.body.addedAt)).toEqual(
      roundToNearestSecond(new Date().toISOString()),
    );
  });

  it('throws an error for an invalid recipe ID or name (400)', async () => {
    const app = createApp().callback();

    const accessToken = await createAccessToken(app);

    const errorReturned =
      'No recipe name or ID. Please provide a valid recipe name and ID.';

    await expectError(
      app,
      { recipeId: 1, recipeName: 'Irish coddled pork with cider' },
      400,
      errorReturned,
      accessToken,
    );
    await expectError(
      app,
      { recipeId: '   ', recipeName: 'Irish coddled pork with cider' },
      400,
      errorReturned,
      accessToken,
    );
    await expectError(
      app,
      { recipeId: 'irish_pork_1', recipeName: 1 },
      400,
      errorReturned,
      accessToken,
    );
    await expectError(
      app,
      { recipeId: 'irish_pork_1', recipeName: '   ' },
      400,
      errorReturned,
      accessToken,
    );
  });

  it('throws an error for an invalid user ID (404)', async () => {
    const app = createApp().callback();

    const accessToken = await createAccessToken(app);

    await userModel.deleteMany({});

    const errorReturned =
      'User not found. Please provide an ID for a valid user.';

    await expectError(
      app,
      { recipeId: 'irish_pork_1', recipeName: 'Irish coddled pork with cider' },
      404,
      errorReturned,
      accessToken,
    );
  });

  it('throws an error if favourite already saved (409)', async () => {
    const app = createApp().callback();

    const accessToken = await createAccessToken(app, {
      _id: 'irish_pork_1',
      name: 'Irish coddled pork with cider',
      addedAt: new Date(),
    });

    const errorReturned = 'Favourite already saved to user profile.';

    await expectError(
      app,
      { recipeId: 'irish_pork_1', recipeName: 'Irish coddled pork with cider' },
      409,
      errorReturned,
      accessToken,
    );
  });
});

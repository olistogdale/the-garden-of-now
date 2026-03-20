import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { createApp } from '../../../app';
import { connectDB, disconnectDB } from '../../../database/db';
import { userModel } from '../../../models/user-model';
import {
  createAccessToken,
  extractAccessToken,
  convertToObject,
} from '../../../utilities/test-utils';

let mongo: MongoMemoryServer;

describe('DELETE /user', () => {
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
    errorCode: number,
    error: string,
    cookie?: any,
  ) {
    const res = cookie
      ? await request(app).delete('/delete').set('Cookie', cookie)
      : await request(app).delete('/delete');
    expect(res.status).toBe(errorCode);
    expect(res.body.error).toBe(error);
  }

  const mockLoginInfo = {
    email: 'bob.simmons@email.com',
    password: 'TheGardenOfNow',
  };

  it('deletes authenticated user and removes access token from cookies (204)', async () => {
    const app = createApp().callback();

    const accessToken = await createAccessToken(app);
    const accessTokenObj = convertToObject(accessToken);

    const res = await request(app).delete('/delete').set('Cookie', accessToken);

    const clearedAccessToken = extractAccessToken(res);
    const clearedAccessTokenObj = convertToObject(clearedAccessToken);

    const deletedUser = await userModel
      .findOne({ email: mockLoginInfo.email.toLowerCase() })
      .lean();

    expect(accessToken).toBeTruthy();
    expect(accessTokenObj.accessToken).toBeTruthy();
    expect(res.status).toBe(204);
    expect(clearedAccessTokenObj.accessToken).toBeFalsy();
    expect(new Date(clearedAccessTokenObj.expires).getTime()).toBeLessThan(
      new Date().getTime(),
    );
    expect(deletedUser).toBeNull();
  });

  it('throws an error if user not found (404)', async () => {
    const app = createApp().callback();

    const accessToken = await createAccessToken(app);

    await userModel.deleteMany({});

    const errorReturned = 'User not found (session invalid).';

    await expectError(app, 404, errorReturned, accessToken);
  });

  it('throws an error if user provides bad token (401)', async () => {
    const app = createApp().callback();

    const errorReturned =
      'Invalid or expired token. Please provide a valid access token.';

    await expectError(app, 401, errorReturned, 'accessToken=bad-token');
  });

  it('throws an error if user fails to provide a token (401)', async () => {
    const app = createApp().callback();

    const errorReturned =
      'Not authenticated. Please provide a valid access token.';

    await expectError(app, 401, errorReturned);
  });
});

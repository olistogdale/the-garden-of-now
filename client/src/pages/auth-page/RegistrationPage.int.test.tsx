import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  mockAuthUser,
  mockRegisterUser,
  mockGetIngredients,
} from '../../test/mock-services';
import { renderApp } from '../../test/render-app';

import type { ErrorWithStatusT } from '../../types/auth-types';

describe('registration page', () => {
  it('disables registration form submission until a valid name, email and password are provided', () => {
    renderApp('/register');

    expect(screen.getByLabelText(/first name/i)).toHaveValue('');
    expect(screen.getByLabelText(/last name/i)).toHaveValue('');
    expect(screen.getByLabelText(/^email/i)).toHaveValue('');
    expect(screen.getByLabelText(/confirm email/i)).toHaveValue('');
    expect(screen.getByLabelText(/^password/i)).toHaveValue('');
    expect(screen.getByLabelText(/confirm password/i)).toHaveValue('');
    expect(
      screen.getByRole('button', { name: /create account/i }),
    ).toBeDisabled();
  });

  it('enables registration form submission once a valid name, email and password are provided.', async () => {
    const user = userEvent.setup();

    renderApp('/register');

    await user.type(screen.getByLabelText(/first name/i), 'Bob');
    await user.type(screen.getByLabelText(/last name/i), 'Simmons');
    await user.type(screen.getByLabelText(/^email/i), 'bob.simmons@email.com');
    await user.type(
      screen.getByLabelText(/confirm email/i),
      'bob.simmons@email.com',
    );
    await user.type(screen.getByLabelText(/^password/i), 'TheGardenOfNow');
    await user.type(
      screen.getByLabelText(/confirm password/i),
      'TheGardenOfNow',
    );

    expect(
      screen.getByRole('button', { name: /create account/i }),
    ).toBeEnabled();
  });

  it('registers user and navigates to home page on submission of a valid name, email and password', async () => {
    mockGetIngredients.mockResolvedValue({
      ingredients: ['carrots', 'tomatoes'],
    });

    const user = userEvent.setup();

    const authErr = new Error('Unauthorized') as ErrorWithStatusT;
    authErr.status = 401;

    mockAuthUser.mockRejectedValue(authErr);

    mockRegisterUser.mockResolvedValue({
      userId: 'bob-simmons-1',
      email: 'bob.simmons@email.com',
      firstName: 'Bob',
      lastName: 'Simmons',
      favourites: [],
    });

    renderApp('/register');

    await user.type(screen.getByLabelText(/first name/i), 'Bob');
    await user.type(screen.getByLabelText(/last name/i), 'Simmons');
    await user.type(screen.getByLabelText(/^email/i), 'bob.simmons@email.com');
    await user.type(
      screen.getByLabelText(/confirm email/i),
      'bob.simmons@email.com',
    );
    await user.type(screen.getByLabelText(/^password/i), 'TheGardenOfNow');
    await user.type(
      screen.getByLabelText(/confirm password/i),
      'TheGardenOfNow',
    );
    await user.click(screen.getByRole('button', { name: /create account/i }));

    expect(mockRegisterUser).toHaveBeenCalledWith(
      {
        firstName: 'Bob',
        lastName: 'Simmons',
        email: 'bob.simmons@email.com',
        password: 'TheGardenOfNow',
      },
      expect.any(AbortSignal),
    );

    expect(
      await screen.findByText(/short on dinner-time inspiration/i),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('button', { name: /browse recipes/i }),
    ).toBeInTheDocument();
  });

  it('displays an error message upon submission of an invalid name, username or password', async () => {
    mockGetIngredients.mockResolvedValue({
      ingredients: ['carrots', 'tomatoes'],
    });

    const user = userEvent.setup();

    const authErr = new Error('Unauthorized') as ErrorWithStatusT;
    authErr.status = 401;

    mockAuthUser.mockRejectedValue(authErr);

    const registerErr = new Error(
      'Sorry, this name, email and password are invalid',
    ) as ErrorWithStatusT;
    registerErr.status = 401;

    mockRegisterUser.mockRejectedValue(registerErr);

    renderApp('/register');

    await user.type(screen.getByLabelText(/first name/i), 'Pamela');
    await user.type(screen.getByLabelText(/last name/i), 'Simons');
    await user.type(screen.getByLabelText(/^email/i), 'pam.simons@email.com');
    await user.type(
      screen.getByLabelText(/confirm email/i),
      'pam.simons@email.com',
    );
    await user.type(screen.getByLabelText(/^password/i), 'TheGardenOfThen');
    await user.type(
      screen.getByLabelText(/confirm password/i),
      'TheGardenOfThen',
    );
    await user.click(screen.getByRole('button', { name: /create account/i }));

    expect(mockRegisterUser).toHaveBeenCalledWith(
      {
        firstName: 'Pamela',
        lastName: 'Simons',
        email: 'pam.simons@email.com',
        password: 'TheGardenOfThen',
      },
      expect.any(AbortSignal),
    );
    expect(await screen.findByRole('alert')).toHaveTextContent(
      /sorry, this name, email and password are invalid/i,
    );
  });
});

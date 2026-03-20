import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  mockAuthUser,
  mockLoginUser,
  mockGetIngredients,
} from '../../test/mock-services';
import { renderApp } from '../../test/render-app';

import type { ErrorWithStatusT } from '../../types/auth-types';

describe('login page', () => {
  it('disables login form submission until a valid email and password are provided', () => {
    renderApp('/login');

    expect(screen.getByLabelText(/email/i)).toHaveValue('');
    expect(screen.getByLabelText(/password/i)).toHaveValue('');
    expect(screen.getByRole('button', { name: /log in/i })).toBeDisabled();
  });

  it('enables login form submission once a valid email and password are provided', async () => {
    const user = userEvent.setup();

    renderApp('/login');

    await user.type(screen.getByLabelText(/email/i), 'bob.simmons@email.com');
    await user.type(screen.getByLabelText(/password/i), 'TheGardenOfNow');
    expect(screen.getByRole('button', { name: /log in/i })).toBeEnabled();
  });

  it('logs user in and navigates to home page on submission of a valid email and password', async () => {
    mockGetIngredients.mockResolvedValue({
      ingredients: ['carrots', 'tomatoes'],
    });

    const user = userEvent.setup();

    const authErr = new Error('Unauthorized') as ErrorWithStatusT;
    authErr.status = 401;

    mockAuthUser.mockRejectedValue(authErr);

    mockLoginUser.mockResolvedValue({
      userId: 'bob-simmons-1',
      email: 'bob.simmons@email.com',
      firstName: 'Bob',
      lastName: 'Simmons',
      favourites: [],
    });

    renderApp('/login');

    await user.type(screen.getByLabelText(/email/i), 'bob.simmons@email.com');
    await user.type(screen.getByLabelText(/password/i), 'TheGardenOfNow');
    await user.click(screen.getByRole('button', { name: /log in/i }));

    expect(mockLoginUser).toHaveBeenCalledWith(
      { email: 'bob.simmons@email.com', password: 'TheGardenOfNow' },
      expect.any(AbortSignal),
    );
    expect(
      await screen.findByText(/short on dinner-time inspiration/i),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('button', { name: /browse recipes/i }),
    ).toBeInTheDocument();
  });

  it('displays an error message upon submission of an invalid email and password', async () => {
    mockGetIngredients.mockResolvedValue({
      ingredients: ['carrots', 'tomatoes'],
    });

    const user = userEvent.setup();

    const authErr = new Error('Unauthorized') as ErrorWithStatusT;
    authErr.status = 401;

    mockAuthUser.mockRejectedValue(authErr);

    const loginErr = new Error(
      'Sorry, this email and password are invalid',
    ) as ErrorWithStatusT;
    loginErr.status = 401;

    mockLoginUser.mockRejectedValue(loginErr);

    renderApp('/login');

    await user.type(screen.getByLabelText(/email/i), 'bob.johnson@email.com');
    await user.type(screen.getByLabelText(/password/i), 'TheGardenOfThen');
    await user.click(screen.getByRole('button', { name: /log in/i }));

    expect(mockLoginUser).toHaveBeenCalledWith(
      { email: 'bob.johnson@email.com', password: 'TheGardenOfThen' },
      expect.any(AbortSignal),
    );
    expect(await screen.findByRole('alert')).toHaveTextContent(
      /sorry, this email and password are invalid/i,
    );
  });
});

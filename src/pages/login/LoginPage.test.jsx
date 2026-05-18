import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

const navigateMock = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => navigateMock };
});

vi.mock('../../api/services', () => ({
  authService: {
    login: vi.fn(),
  },
}));

import { authService } from '../../api/services';
import LoginPage from './LoginPage';

const renderPage = () =>
  render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  );

beforeEach(() => {
  authService.login.mockReset();
  navigateMock.mockReset();
  localStorage.clear();
});

describe('LoginPage', () => {
  it('stores the returned token and navigates home on success', async () => {
    authService.login.mockResolvedValueOnce({ data: { token: 'jwt-token' } });
    renderPage();

    await userEvent.type(screen.getByLabelText(/usuario/i), 'admin');
    await userEvent.type(screen.getByLabelText(/contraseña/i), 'admin12345');
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({
        username: 'admin',
        password: 'admin12345',
      });
    });
    expect(localStorage.getItem('authToken')).toBe('jwt-token');
    expect(navigateMock).toHaveBeenCalledWith('/');
  });

  it('shows the backend error message on 401', async () => {
    authService.login.mockRejectedValueOnce({
      response: { data: { message: 'Invalid credentials' } },
    });
    renderPage();

    await userEvent.type(screen.getByLabelText(/usuario/i), 'admin');
    await userEvent.type(screen.getByLabelText(/contraseña/i), 'wrong');
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }));

    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument();
    expect(localStorage.getItem('authToken')).toBeNull();
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it('falls back to a generic message when the backend response is missing', async () => {
    authService.login.mockRejectedValueOnce(new Error('boom'));
    renderPage();

    await userEvent.type(screen.getByLabelText(/usuario/i), 'admin');
    await userEvent.type(screen.getByLabelText(/contraseña/i), 'oops');
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }));

    expect(await screen.findByText('Credenciales inválidas')).toBeInTheDocument();
  });
});

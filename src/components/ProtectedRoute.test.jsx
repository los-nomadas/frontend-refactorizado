import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute';
import { AuthProvider } from '../context/AuthContext';

const LocationLabel = () => {
  const location = useLocation();
  return <div>{location.pathname}</div>;
};

const renderProtectedRoute = (initialPath = '/dashboard') =>
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <AuthProvider>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>Private dashboard</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LocationLabel />} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );

beforeEach(() => {
  localStorage.clear();
});

describe('ProtectedRoute', () => {
  it('redirects unauthenticated users to login', () => {
    renderProtectedRoute();

    expect(screen.getByText('/login')).toBeInTheDocument();
  });

  it('renders protected content when authToken exists', () => {
    localStorage.setItem('authToken', 'jwt-token');

    renderProtectedRoute();

    expect(screen.getByText('Private dashboard')).toBeInTheDocument();
  });
});

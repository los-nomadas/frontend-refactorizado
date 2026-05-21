import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../api/services', () => ({
  tripService: {
    getOffers: vi.fn(),
  },
}));

import { tripService } from '../../api/services';
import { AuthProvider } from '../../context/AuthContext';
import HomePage from './HomePage';

const renderPage = () =>
  render(
    <MemoryRouter>
      <AuthProvider>
        <HomePage />
      </AuthProvider>
    </MemoryRouter>
  );

beforeEach(() => {
  tripService.getOffers.mockReset();
});

describe('HomePage', () => {
  it('lists the offer trips returned by the backend', async () => {
    tripService.getOffers.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          destination: 'Lisboa',
          description: 'Escapada de fin de semana',
          departureDate: '2026-06-10',
          returnDate: '2026-06-13',
          priceAdult: 120,
          priceChild: 60,
          priceSenior: 90,
          boardType: 'FULL_BOARD',
          imageUrl: 'https://example.com/lisbon.png',
        },
      ],
    });

    renderPage();

    expect(await screen.findByText('Lisboa')).toBeInTheDocument();
    expect(screen.getByText(/Adulto €120/)).toBeInTheDocument();
    expect(screen.getByText(/Niño €60/)).toBeInTheDocument();
    expect(screen.getByText(/Senior €90/)).toBeInTheDocument();
    expect(screen.getByText(/Pensión completa/)).toBeInTheDocument();
  });

  it('shows the empty state when no offers come back', async () => {
    tripService.getOffers.mockResolvedValueOnce({ data: [] });
    renderPage();

    await waitFor(() => {
      expect(screen.getByText(/No hay viajes disponibles/i)).toBeInTheDocument();
    });
  });

  it('surfaces an error alert when the request fails', async () => {
    tripService.getOffers.mockRejectedValueOnce(new Error('boom'));
    renderPage();

    expect(await screen.findByText(/Error al cargar los viajes/i)).toBeInTheDocument();
  });
});

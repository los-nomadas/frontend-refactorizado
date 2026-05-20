import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../api/services', () => ({
  bookingService: {
    getMy: vi.fn(),
  },
}));

import { bookingService } from '../../api/services';
import MyBookingsPage from './MyBookingsPage';

const renderPage = () =>
  render(
    <MemoryRouter>
      <MyBookingsPage />
    </MemoryRouter>
  );

beforeEach(() => {
  bookingService.getMy.mockReset();
});

describe('MyBookingsPage', () => {
  it('lists the bookings returned by GET /bookings/my', async () => {
    bookingService.getMy.mockResolvedValueOnce({
      data: [
        {
          id: 7,
          tripDestination: 'Lisboa',
          hotelName: 'Hotel Sol',
          tripDepartureDate: '2026-06-10',
          tripReturnDate: '2026-06-13',
          boardType: 'FULL_BOARD',
          groupType: 'NONE',
          companions: [{ firstName: 'Carla', lastName: 'Vega', birthDate: '1985-03-10' }],
          tripStatus: 'AVAILABLE',
          totalPrice: 180,
        },
      ],
    });

    renderPage();

    expect(await screen.findByText('Lisboa')).toBeInTheDocument();
    expect(screen.getByText('Hotel: Hotel Sol')).toBeInTheDocument();
    expect(screen.getByText(/Pensión completa/)).toBeInTheDocument();
    expect(screen.getByText(/Total: €180/)).toBeInTheDocument();
  });

  it('shows the empty state when the customer has no bookings', async () => {
    bookingService.getMy.mockResolvedValueOnce({ data: [] });
    renderPage();

    await waitFor(() => {
      expect(screen.getByText(/Todavía no tienes reservas/i)).toBeInTheDocument();
    });
  });

  it('shows the not-linked message when the backend responds 404', async () => {
    bookingService.getMy.mockRejectedValueOnce({ response: { status: 404 } });
    renderPage();

    expect(
      await screen.findByText('No hay un usuario cliente vinculado a esta cuenta.')
    ).toBeInTheDocument();
  });

  it('shows the session-expired message when the backend responds 401', async () => {
    bookingService.getMy.mockRejectedValueOnce({ response: { status: 401 } });
    renderPage();

    expect(
      await screen.findByText(/Tu sesión ha caducado/i)
    ).toBeInTheDocument();
  });
});

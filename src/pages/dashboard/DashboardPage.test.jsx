import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../api/services', () => ({
  dashboardService: {
    getTripsByYear: vi.fn(),
    getCurrentYearRevenue: vi.fn(),
    getTopTrips: vi.fn(),
    getTotalUsers: vi.fn(),
    getTotalTrips: vi.fn(),
    getRecentBookings: vi.fn(),
  },
}));

import { dashboardService } from '../../api/services';
import DashboardPage from './DashboardPage';

const renderPage = () =>
  render(
    <MemoryRouter>
      <DashboardPage />
    </MemoryRouter>
  );

beforeEach(() => {
  dashboardService.getTripsByYear.mockReset();
  dashboardService.getCurrentYearRevenue.mockReset();
  dashboardService.getTopTrips.mockReset();
  dashboardService.getTotalUsers.mockReset();
  dashboardService.getTotalTrips.mockReset();
  dashboardService.getRecentBookings.mockReset();
});

describe('DashboardPage', () => {
  it('renders revenue and top trips when the backend serialises numbers as strings', async () => {
    dashboardService.getTripsByYear.mockResolvedValue({ data: { year: 2026, totalTrips: 5 } });
    dashboardService.getCurrentYearRevenue.mockResolvedValue({
      data: { year: 2026, totalRevenue: '1234.5' },
    });
    dashboardService.getTopTrips.mockResolvedValue({
      data: [
        { tripId: 1, destination: 'Lisboa', revenue: '900.00' },
        { tripId: 2, destination: 'Paris', revenue: '250.00' },
      ],
    });
    dashboardService.getTotalUsers.mockResolvedValue({ data: [{ id: 1 }, { id: 2 }] });
    dashboardService.getTotalTrips.mockResolvedValue({ data: [{ id: 1 }, { id: 2 }, { id: 3 }] });
    dashboardService.getRecentBookings.mockResolvedValue({
      data: [
        { id: 1, userFullName: 'Carla Nomadas', tripDestination: 'Lisboa', totalPrice: '900.00' },
      ],
    });

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('5')).toBeInTheDocument();
    });
    expect(screen.getByText('€1234.50')).toBeInTheDocument();
    expect(screen.getAllByText('Lisboa').length).toBeGreaterThan(0);
    expect(screen.getAllByText('€900.00').length).toBeGreaterThan(0);
    expect(screen.getByText('€250.00')).toBeInTheDocument();
  });

  it('shows an error alert when any dashboard endpoint fails', async () => {
    dashboardService.getTripsByYear.mockRejectedValue(new Error('boom'));
    dashboardService.getCurrentYearRevenue.mockResolvedValue({
      data: { year: 2026, totalRevenue: '0' },
    });
    dashboardService.getTopTrips.mockResolvedValue({ data: [] });
    dashboardService.getTotalUsers.mockResolvedValue({ data: [] });
    dashboardService.getTotalTrips.mockResolvedValue({ data: [] });
    dashboardService.getRecentBookings.mockResolvedValue({ data: [] });

    renderPage();

    expect(await screen.findByText(/Error al cargar el dashboard/i)).toBeInTheDocument();
  });
});

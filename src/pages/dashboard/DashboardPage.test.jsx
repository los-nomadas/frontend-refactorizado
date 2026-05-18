import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../api/services', () => ({
  dashboardService: {
    getTripsByYear: vi.fn(),
    getCurrentYearRevenue: vi.fn(),
    getTopTrips: vi.fn(),
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

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('5')).toBeInTheDocument();
    });
    expect(screen.getByText('€1234.50')).toBeInTheDocument();
    expect(screen.getByText(/1\. Lisboa/)).toBeInTheDocument();
    expect(screen.getByText('€900.00')).toBeInTheDocument();
    expect(screen.getByText('€250.00')).toBeInTheDocument();
  });

  it('shows an error alert when any dashboard endpoint fails', async () => {
    dashboardService.getTripsByYear.mockRejectedValue(new Error('boom'));
    dashboardService.getCurrentYearRevenue.mockResolvedValue({
      data: { year: 2026, totalRevenue: '0' },
    });
    dashboardService.getTopTrips.mockResolvedValue({ data: [] });

    renderPage();

    expect(await screen.findByText(/Error al cargar el dashboard/i)).toBeInTheDocument();
  });
});

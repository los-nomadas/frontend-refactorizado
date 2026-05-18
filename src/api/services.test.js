import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./apiConfig', () => {
  const mockClient = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  };
  return { default: mockClient };
});

import apiClient from './apiConfig';
import {
  authService,
  bookingService,
  busService,
  dashboardService,
  driverService,
  hotelService,
  tripService,
  userService,
} from './services';

beforeEach(() => {
  for (const method of ['get', 'post', 'put', 'delete']) {
    apiClient[method].mockReset();
    apiClient[method].mockResolvedValue({ data: {} });
  }
});

afterEach(() => {
  localStorage.clear();
});

describe('userService', () => {
  it('targets /users for the full CRUD surface', () => {
    userService.getAll();
    userService.getById(1);
    userService.create({ firstName: 'Carla' });
    userService.update(1, { firstName: 'Carla' });
    userService.delete(1);

    expect(apiClient.get).toHaveBeenNthCalledWith(1, '/users');
    expect(apiClient.get).toHaveBeenNthCalledWith(2, '/users/1');
    expect(apiClient.post).toHaveBeenCalledWith('/users', { firstName: 'Carla' });
    expect(apiClient.put).toHaveBeenCalledWith('/users/1', { firstName: 'Carla' });
    expect(apiClient.delete).toHaveBeenCalledWith('/users/1');
  });
});

describe('tripService', () => {
  it('exposes getOffers under /trips/offers', () => {
    tripService.getOffers();
    expect(apiClient.get).toHaveBeenCalledWith('/trips/offers');
  });

  it('builds the rest of the trip routes', () => {
    tripService.getAll();
    tripService.getById(7);
    tripService.create({ destination: 'Lisboa' });
    tripService.update(7, { destination: 'Lisboa' });
    tripService.delete(7);

    expect(apiClient.get).toHaveBeenCalledWith('/trips');
    expect(apiClient.get).toHaveBeenCalledWith('/trips/7');
    expect(apiClient.post).toHaveBeenCalledWith('/trips', { destination: 'Lisboa' });
    expect(apiClient.put).toHaveBeenCalledWith('/trips/7', { destination: 'Lisboa' });
    expect(apiClient.delete).toHaveBeenCalledWith('/trips/7');
  });
});

describe('bookingService', () => {
  it('posts bookings against /bookings', () => {
    bookingService.create({ userId: 1, tripId: 2, companions: [] });
    expect(apiClient.post).toHaveBeenCalledWith('/bookings', {
      userId: 1,
      tripId: 2,
      companions: [],
    });
  });
});

describe('dashboardService', () => {
  it('builds year query strings for trips-by-year and top-trips', () => {
    dashboardService.getTripsByYear(2026);
    dashboardService.getCurrentYearRevenue();
    dashboardService.getTopTrips(2026);

    expect(apiClient.get).toHaveBeenCalledWith('/dashboard/trips-by-year?year=2026');
    expect(apiClient.get).toHaveBeenCalledWith('/dashboard/current-year-revenue');
    expect(apiClient.get).toHaveBeenCalledWith('/dashboard/top-trips?year=2026');
  });
});

describe('hotelService, busService, driverService surface', () => {
  it('hits the expected resource paths', () => {
    hotelService.getAll();
    busService.getAll();
    driverService.getAll();

    expect(apiClient.get).toHaveBeenCalledWith('/hotels');
    expect(apiClient.get).toHaveBeenCalledWith('/buses');
    expect(apiClient.get).toHaveBeenCalledWith('/drivers');
  });
});

describe('authService', () => {
  it('posts credentials to /auth/login', async () => {
    apiClient.post.mockResolvedValueOnce({ data: { token: 'jwt-token' } });
    const response = await authService.login({ username: 'admin', password: 'admin12345' });
    expect(apiClient.post).toHaveBeenCalledWith('/auth/login', {
      username: 'admin',
      password: 'admin12345',
    });
    expect(response.data.token).toBe('jwt-token');
  });

  it('logout clears the stored token and isAuthenticated reflects it', () => {
    localStorage.setItem('authToken', 'jwt-token');
    expect(authService.isAuthenticated()).toBe(true);
    authService.logout();
    expect(authService.isAuthenticated()).toBe(false);
  });
});

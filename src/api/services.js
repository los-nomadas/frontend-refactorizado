import apiClient from './apiConfig';

export const userService = {
  getAll: () => apiClient.get('/users'),
  getById: (id) => apiClient.get(`/users/${id}`),
  create: (user) => apiClient.post('/users', user),
  update: (id, user) => apiClient.put(`/users/${id}`, user),
  delete: (id) => apiClient.delete(`/users/${id}`),
};

export const hotelService = {
  getAll: () => apiClient.get('/hotels'),
  getById: (id) => apiClient.get(`/hotels/${id}`),
  create: (hotel) => apiClient.post('/hotels', hotel),
  update: (id, hotel) => apiClient.put(`/hotels/${id}`, hotel),
  delete: (id) => apiClient.delete(`/hotels/${id}`),
};

export const busService = {
  getAll: () => apiClient.get('/buses'),
  getById: (id) => apiClient.get(`/buses/${id}`),
  create: (bus) => apiClient.post('/buses', bus),
  update: (id, bus) => apiClient.put(`/buses/${id}`, bus),
  delete: (id) => apiClient.delete(`/buses/${id}`),
};

export const driverService = {
  getAll: () => apiClient.get('/drivers'),
  getById: (id) => apiClient.get(`/drivers/${id}`),
  create: (driver) => apiClient.post('/drivers', driver),
  update: (id, driver) => apiClient.put(`/drivers/${id}`, driver),
  delete: (id) => apiClient.delete(`/drivers/${id}`),
};

export const tripService = {
  getAll: () => apiClient.get('/trips'),
  getOffers: () => apiClient.get('/trips/offers'),
  getById: (id) => apiClient.get(`/trips/${id}`),
  create: (trip) => apiClient.post('/trips', trip),
  update: (id, trip) => apiClient.put(`/trips/${id}`, trip),
  delete: (id) => apiClient.delete(`/trips/${id}`),
};

export const bookingService = {
  getAll: () => apiClient.get('/bookings'),
  getById: (id) => apiClient.get(`/bookings/${id}`),
  create: (booking) => apiClient.post('/bookings', booking),
  update: (id, booking) => apiClient.put(`/bookings/${id}`, booking),
  delete: (id) => apiClient.delete(`/bookings/${id}`),
};

export const dashboardService = {
  getTripsByYear: (year) => apiClient.get(`/dashboard/trips-by-year?year=${year}`),
  getCurrentYearRevenue: () => apiClient.get('/dashboard/current-year-revenue'),
  getTopTrips: (year) => apiClient.get(`/dashboard/top-trips?year=${year}`),
};

export const authService = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  logout: () => {
    localStorage.removeItem('authToken');
  },
};

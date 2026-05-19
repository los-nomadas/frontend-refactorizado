import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/login/LoginPage';
import TripsPage from './pages/trips/TripsPage';
import TripDetailPage from './pages/trips/TripDetailPage';
import UsersPage from './pages/users/UsersPage';
import UserDetailPage from './pages/users/UserDetailPage';
import HotelsPage from './pages/hotels/HotelsPage';
import HotelDetailPage from './pages/hotels/HotelDetailPage';
import BusesPage from './pages/buses/BusesPage';
import BusDetailPage from './pages/buses/BusDetailPage';
import DriversPage from './pages/drivers/DriversPage';
import DriverDetailPage from './pages/drivers/DriverDetailPage';
import BookingsPage from './pages/bookings/BookingsPage';
import BusDetailPage from './pages/buses/BusDetailPage';
import BusesPage from './pages/buses/BusesPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import DriverDetailPage from './pages/drivers/DriverDetailPage';
import DriversPage from './pages/drivers/DriversPage';
import HomePage from './pages/home/HomePage';
import HotelDetailPage from './pages/hotels/HotelDetailPage';
import HotelsPage from './pages/hotels/HotelsPage';
import LoginPage from './pages/login/LoginPage';
import MyBookingsPage from './pages/bookings/MyBookingsPage';
import ProfilePage from './pages/profile/ProfilePage';
import TripDetailPage from './pages/trips/TripDetailPage';
import TripsPage from './pages/trips/TripsPage';
import UserDetailPage from './pages/users/UserDetailPage';
import UsersPage from './pages/users/UsersPage';

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/trips" element={<TripsPage />} />
            <Route path="/trips/:id" element={<TripDetailPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/users/:id" element={<UserDetailPage />} />
            <Route path="/hotels" element={<HotelsPage />} />
            <Route path="/hotels/:id" element={<HotelDetailPage />} />
            <Route path="/buses" element={<BusesPage />} />
            <Route path="/buses/:id" element={<BusDetailPage />} />
            <Route path="/drivers" element={<DriversPage />} />
            <Route path="/drivers/:id" element={<DriverDetailPage />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;

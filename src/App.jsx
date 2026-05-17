import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/home/HomePage';
import TripsPage from './pages/trips/TripsPage';
import TripDetailPage from './pages/trips/TripDetailPage';
import UsersPage from './pages/users/UsersPage';
import HotelsPage from './pages/hotels/HotelsPage';
import BusesPage from './pages/buses/BusesPage';
import DriversPage from './pages/drivers/DriversPage';
import BookingsPage from './pages/bookings/BookingsPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/trips" element={<TripsPage />} />
            <Route path="/trips/:id" element={<TripDetailPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/hotels" element={<HotelsPage />} />
            <Route path="/buses" element={<BusesPage />} />
            <Route path="/drivers" element={<DriversPage />} />
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

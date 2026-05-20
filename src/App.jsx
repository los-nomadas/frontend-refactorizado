import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AccessibilityWidget from './components/accessibility/AccessibilityWidget';
import ProtectedRoute from './components/ProtectedRoute';
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
import MyBookingsPage from './pages/bookings/MyBookingsPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ProfilePage from './pages/profile/ProfilePage';

function App() {
  return (
    <BrowserRouter>
      <>
        {/*
         * #app-content is the CSS target for accessibility filters.
         * Filters live in index.css (html.a11y-* #app-content) so the
         * browser applies GPU transitions without React re-renders.
         */}
        <div id="app-content" className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/trips" element={<TripsPage />} />
              <Route path="/trips/:id" element={<TripDetailPage />} />
              <Route path="/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
              <Route path="/users/:id" element={<ProtectedRoute><UserDetailPage /></ProtectedRoute>} />
              <Route path="/hotels" element={<ProtectedRoute><HotelsPage /></ProtectedRoute>} />
              <Route path="/hotels/:id" element={<ProtectedRoute><HotelDetailPage /></ProtectedRoute>} />
              <Route path="/buses" element={<ProtectedRoute><BusesPage /></ProtectedRoute>} />
              <Route path="/buses/:id" element={<ProtectedRoute><BusDetailPage /></ProtectedRoute>} />
              <Route path="/drivers" element={<ProtectedRoute><DriversPage /></ProtectedRoute>} />
              <Route path="/drivers/:id" element={<ProtectedRoute><DriverDetailPage /></ProtectedRoute>} />
              <Route path="/bookings" element={<ProtectedRoute><BookingsPage /></ProtectedRoute>} />
              <Route path="/my-bookings" element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            </Routes>
          </main>
          <Footer />
        </div>

        {/* Outside #app-content so the widget is never affected by filters */}
        <AccessibilityWidget />
      </>
    </BrowserRouter>
  );
}

export default App;

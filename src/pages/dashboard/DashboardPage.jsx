import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService } from '../../api/services';
import { Loading, Alert } from '../../components/common/Feedback';
import StatCard from '../../components/dashboard/StatCard';
import RecentBookings from '../../components/dashboard/RecentBookings';
import OccupancyChart from '../../components/dashboard/OccupancyChart';

const DashboardPage = () => {
  const [dashboard, setDashboard] = useState({
    tripsByYear: null,
    currentYearRevenue: null,
    topTrips: [],
    totalUsers: 0,
    totalTrips: 0,
    totalBookings: 0,
    recentBookings: [],
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const loadDashboard = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      else setRefreshing(true);

      const [
        tripsByYearRes,
        revenueRes,
        topTripsRes,
        usersRes,
        tripsRes,
        bookingsRes,
      ] = await Promise.all([
        dashboardService.getTripsByYear(selectedYear),
        dashboardService.getCurrentYearRevenue(),
        dashboardService.getTopTrips(selectedYear),
        dashboardService.getTotalUsers(),
        dashboardService.getTotalTrips(),
        dashboardService.getRecentBookings(5),
      ]);

      setDashboard({
        tripsByYear: tripsByYearRes.data,
        currentYearRevenue: revenueRes.data,
        topTrips: topTripsRes.data || [],
        totalUsers: usersRes.data?.length || 0,
        totalTrips: tripsRes.data?.length || 0,
        totalBookings: bookingsRes.data?.length || 0,
        recentBookings: bookingsRes.data?.slice(0, 5) || [],
      });
      setError(null);
    } catch (err) {
      setError('Error al cargar el dashboard');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [selectedYear]);

  const handleRefresh = () => {
    loadDashboard(false);
  };

  const formatAmount = (value) => {
    const number = Number(value);
    return Number.isFinite(number) ? number.toFixed(2) : '0.00';
  };

  const availableYears = [2024, 2025, 2026];

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Panel Administrativo
              </h1>
              <p className="text-gray-600 mt-2">
                Bienvenido al dashboard de métricas y análisis
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {refreshing ? 'Actualizando...' : 'Actualizar'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="container mx-auto px-4 mt-6">
          <Alert type="error" message={error} onClose={() => setError(null)} />
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Usuarios"
            value={dashboard.totalUsers}
            subtitle="Usuarios registrados"
            color="blue"
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 12H9m6 0a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            }
          />

          <StatCard
            title="Viajes Organizados"
            value={dashboard.tripsByYear?.totalTrips || 0}
            subtitle={`En el año ${selectedYear}`}
            color="green"
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            }
          />

          <StatCard
            title="Total Reservas"
            value={dashboard.totalBookings}
            subtitle="Todas las reservas"
            color="purple"
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />

          <StatCard
            title="Ingresos Totales"
            value={`€${formatAmount(dashboard.currentYearRevenue?.totalRevenue)}`}
            subtitle={`Año ${selectedYear}`}
            color="amber"
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 space-y-8">
            <OccupancyChart topTrips={dashboard.topTrips} />
            <RecentBookings bookings={dashboard.recentBookings} />
          </div>

          <div className="space-y-6">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Resumen Rápido</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Tasa de Ocupación</span>
                  <span className="text-lg font-semibold text-green-600">
                    {dashboard.totalTrips > 0
                      ? Math.round(
                          (dashboard.totalBookings / (dashboard.totalTrips * 30)) *
                            100
                        )
                      : 0}
                    %
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Promedio por Viaje</span>
                  <span className="text-lg font-semibold text-blue-600">
                    €
                    {dashboard.topTrips.length > 0
                      ? formatAmount(
                          dashboard.topTrips.reduce(
                            (acc, trip) => acc + Number(trip.revenue || 0),
                            0
                          ) / dashboard.topTrips.length
                        )
                      : '0.00'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-gray-600">Total Viajes</span>
                  <span className="text-lg font-semibold text-purple-600">
                    {dashboard.totalTrips}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Acciones Rápidas</h3>
              <div className="space-y-2">
                <Link
                  to="/trips"
                  className="block w-full text-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium transition-colors"
                >
                  Ver Todos los Viajes
                </Link>
                <Link
                  to="/bookings"
                  className="block w-full text-center px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 font-medium transition-colors"
                >
                  Ver Todas las Reservas
                </Link>
                <Link
                  to="/users"
                  className="block w-full text-center px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 font-medium transition-colors"
                >
                  Ver Todos los Usuarios
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

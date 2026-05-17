import React, { useState, useEffect } from 'react';
import { dashboardService } from '../../api/services';
import { Loading, Alert } from '../../components/common/Feedback';

const DashboardPage = () => {
  const [dashboard, setDashboard] = useState({
    tripsByYear: null,
    currentYearRevenue: null,
    topTrips: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    loadDashboard();
  }, [selectedYear]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [tripsByYearRes, revenueRes, topTripsRes] = await Promise.all([
        dashboardService.getTripsByYear(selectedYear),
        dashboardService.getCurrentYearRevenue(),
        dashboardService.getTopTrips(selectedYear),
      ]);

      setDashboard({
        tripsByYear: tripsByYearRes.data,
        currentYearRevenue: revenueRes.data,
        topTrips: topTripsRes.data || [],
      });
    } catch (err) {
      setError('Error al cargar el dashboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (value) => {
    const number = Number(value);
    return Number.isFinite(number) ? number.toFixed(2) : '0.00';
  };

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard Dirección</h1>

      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      <div className="mb-8">
        <label className="block text-sm font-semibold mb-2">
          Seleccionar Año:
        </label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="px-4 py-2 border rounded"
        >
          {[2024, 2025, 2026].map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Viajes en {selectedYear}</h2>
          <p className="text-4xl font-bold text-blue-600">
            {dashboard.tripsByYear?.totalTrips || 0}
          </p>
          <p className="text-gray-600 mt-2">Total de viajes organizados</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Ingresos {selectedYear}</h2>
          <p className="text-4xl font-bold text-green-600">
            €{formatAmount(dashboard.currentYearRevenue?.totalRevenue)}
          </p>
          <p className="text-gray-600 mt-2">Ingresos totales del año</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Top 3 Viajes Más Rentables</h2>
        {dashboard.topTrips.length === 0 ? (
          <p className="text-gray-600">No hay datos disponibles</p>
        ) : (
          <div className="space-y-4">
            {dashboard.topTrips.map((trip, index) => (
              <div
                key={trip.tripId}
                className="flex items-center justify-between border-b pb-4"
              >
                <div>
                  <p className="font-semibold">
                    {index + 1}. {trip.destination}
                  </p>
                  <p className="text-gray-600 text-sm">ID: {trip.tripId}</p>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  €{formatAmount(trip.revenue)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;

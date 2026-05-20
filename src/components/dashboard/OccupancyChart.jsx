const OccupancyChart = ({ topTrips = [] }) => {
  const formatAmount = (value) => {
    const number = Number(value);
    return Number.isFinite(number) ? number.toFixed(2) : '0.00';
  };

  if (topTrips.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Viajes Más Rentables</h3>
        <p className="text-gray-500 text-center py-8 text-sm">
          No hay datos disponibles
        </p>
      </div>
    );
  }

  const maxRevenue = Math.max(...topTrips.map((trip) => Number(trip.revenue) || 0));

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Viajes Más Rentables</h3>
      <div className="space-y-5">
        {topTrips.map((trip, index) => {
          const revenue = Number(trip.revenue) || 0;
          const percentage = maxRevenue > 0 ? (revenue / maxRevenue) * 100 : 0;

          return (
            <div key={trip.tripId}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3 flex-grow">
                  <span className="text-sm font-bold text-gray-400 w-6">
                    {index + 1}
                  </span>
                  <p className="font-medium text-gray-900 text-sm truncate">
                    {trip.destination}
                  </p>
                </div>
                <p className="font-bold text-sm text-success-600 flex-shrink-0">
                  €{formatAmount(revenue)}
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-success-400 to-success-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OccupancyChart;

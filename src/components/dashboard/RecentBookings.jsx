const RecentBookings = ({ bookings = [] }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatAmount = (value) => {
    const number = Number(value);
    return Number.isFinite(number) ? `€${number.toFixed(2)}` : '€0.00';
  };

  const getStatusColor = (status) => {
    const statusMap = {
      CONFIRMED: 'bg-green-100 text-green-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      CANCELLED: 'bg-red-100 text-red-800',
      COMPLETED: 'bg-blue-100 text-blue-800',
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  if (bookings.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Reservas Recientes</h3>
        <p className="text-gray-500 text-center py-8 text-sm">
          No hay reservas disponibles
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm overflow-hidden">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Reservas Recientes</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs">
                ID Reserva
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs">
                Usuario
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs">
                Viaje
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs">
                Fecha
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs">
                Total
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs">
                Estado
              </th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, idx) => (
              <tr key={booking.id} className={`border-b border-gray-100 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50`}>
                <td className="py-3 px-4 font-medium text-gray-900 text-xs">
                  #{booking.id}
                </td>
                <td className="py-3 px-4 text-gray-600 text-xs">
                  {booking.user?.name || 'N/A'}
                </td>
                <td className="py-3 px-4 text-gray-600 text-xs">
                  {booking.trip?.destination || 'N/A'}
                </td>
                <td className="py-3 px-4 text-gray-600 text-xs">
                  {formatDate(booking.bookingDate)}
                </td>
                <td className="py-3 px-4 font-semibold text-success-600 text-xs">
                  {formatAmount(booking.totalPrice)}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}
                  >
                    {booking.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentBookings;

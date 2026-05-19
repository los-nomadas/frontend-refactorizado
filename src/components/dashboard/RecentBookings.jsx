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
        <h3 className="text-lg font-semibold mb-4">Reservas Recientes</h3>
        <p className="text-gray-500 text-center py-8">
          No hay reservas disponibles
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Reservas Recientes</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                ID Reserva
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Usuario
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Viaje
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Fecha
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Total
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Estado
              </th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-gray-900">
                  #{booking.id}
                </td>
                <td className="py-3 px-4 text-gray-600">
                  {booking.user?.name || 'N/A'}
                </td>
                <td className="py-3 px-4 text-gray-600">
                  {booking.trip?.destination || 'N/A'}
                </td>
                <td className="py-3 px-4 text-gray-600">
                  {formatDate(booking.bookingDate)}
                </td>
                <td className="py-3 px-4 font-semibold text-green-600">
                  {formatAmount(booking.totalPrice)}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}
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

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { bookingService } from '../../api/services';
import { Loading, EmptyState, Alert } from '../../components/common/Feedback';
import Button from '../../components/common/Button';

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getAll();
      setBookings(response.data || []);
    } catch (err) {
      setError('Error al cargar reservas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('¿Cancelar esta reserva? Se liberarán las plazas.')) {
      return;
    }
    try {
      await bookingService.delete(id);
      loadBookings();
    } catch (err) {
      setError('Error al eliminar reserva');
      console.error(err);
    }
  };

  const boardLabel = (boardType) =>
    boardType === 'FULL_BOARD' ? 'Pensión completa' : 'Media pensión';

  const groupLabel = (groupType) => {
    if (groupType === 'IMSERSO') return 'IMSERSO';
    if (groupType === 'SCHOOL') return 'Escolar';
    return 'Individual';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Reservas</h1>
        <Link
          to="/trips"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
        >
          + Nueva reserva desde un viaje
        </Link>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      {loading ? (
        <Loading />
      ) : bookings.length === 0 ? (
        <EmptyState message="No hay reservas registradas" />
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">ID</th>
                <th className="px-4 py-3 text-left font-semibold">Cliente</th>
                <th className="px-4 py-3 text-left font-semibold">Viaje</th>
                <th className="px-4 py-3 text-left font-semibold">Régimen</th>
                <th className="px-4 py-3 text-left font-semibold">Grupo</th>
                <th className="px-4 py-3 text-left font-semibold">Viajeros</th>
                <th className="px-4 py-3 text-right font-semibold">Descuento</th>
                <th className="px-4 py-3 text-right font-semibold">Total</th>
                <th className="px-4 py-3 text-left font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{booking.id}</td>
                  <td className="px-4 py-3">{booking.userFullName}</td>
                  <td className="px-4 py-3">{booking.tripDestination}</td>
                  <td className="px-4 py-3">{boardLabel(booking.boardType)}</td>
                  <td className="px-4 py-3">{groupLabel(booking.groupType)}</td>
                  <td className="px-4 py-3">{booking.companions?.length ?? 0}</td>
                  <td className="px-4 py-3 text-right">€{booking.groupDiscount}</td>
                  <td className="px-4 py-3 text-right font-semibold">€{booking.totalPrice}</td>
                  <td className="px-4 py-3">
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(booking.id)}
                    >
                      Cancelar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;

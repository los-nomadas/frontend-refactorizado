import React, { useState, useEffect } from 'react';
import { bookingService } from '../../api/services';
import { Loading, EmptyState, Alert } from '../../components/common/Feedback';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    tripId: '',
    boardType: 'HALF_BOARD',
    groupType: 'NONE',
  });

  useEffect(() => {
    loadBookings();
  }, []);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await bookingService.create(formData);
      setIsModalOpen(false);
      setFormData({
        userId: '',
        tripId: '',
        boardType: 'HALF_BOARD',
        groupType: 'NONE',
      });
      loadBookings();
    } catch (err) {
      setError('Error al crear reserva');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta reserva?')) {
      try {
        await bookingService.delete(id);
        loadBookings();
      } catch (err) {
        setError('Error al eliminar reserva');
        console.error(err);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Reservas</h1>
        <Button onClick={() => setIsModalOpen(true)}>+ Nueva Reserva</Button>
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
                <th className="px-6 py-4 text-left font-semibold">ID Reserva</th>
                <th className="px-6 py-4 text-left font-semibold">Usuario</th>
                <th className="px-6 py-4 text-left font-semibold">Viaje</th>
                <th className="px-6 py-4 text-left font-semibold">Tipo Pensión</th>
                <th className="px-6 py-4 text-left font-semibold">Grupo</th>
                <th className="px-6 py-4 text-left font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{booking.id}</td>
                  <td className="px-6 py-4">{booking.userId}</td>
                  <td className="px-6 py-4">{booking.tripId}</td>
                  <td className="px-6 py-4">{booking.boardType}</td>
                  <td className="px-6 py-4">{booking.groupType}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800">Ver</button>
                    <button
                      onClick={() => handleDelete(booking.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Crear Nueva Reserva"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="userId"
            placeholder="ID Usuario"
            value={formData.userId}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="text"
            name="tripId"
            placeholder="ID Viaje"
            value={formData.tripId}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <select
            name="boardType"
            value={formData.boardType}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded"
          >
            <option value="HALF_BOARD">Media Pensión</option>
            <option value="FULL_BOARD">Pensión Completa</option>
          </select>
          <select
            name="groupType"
            value={formData.groupType}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded"
          >
            <option value="NONE">Sin Grupo</option>
            <option value="IMSERSO">IMSERSO</option>
            <option value="SCHOOL">Escuela</option>
          </select>
          <div className="flex gap-2 pt-4">
            <Button type="submit" variant="success">
              Crear
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BookingsPage;

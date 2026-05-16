import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tripService } from '../../api/services';
import { Loading, EmptyState, Alert } from '../../components/common/Feedback';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

const TripsPage = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    destination: '',
    description: '',
    departureDate: '',
    returnDate: '',
    priceAdult: '',
  });

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      setLoading(true);
      const response = await tripService.getAll();
      setTrips(response.data || []);
    } catch (err) {
      setError('Error al cargar los viajes');
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
      await tripService.create(formData);
      setIsModalOpen(false);
      setFormData({
        destination: '',
        description: '',
        departureDate: '',
        returnDate: '',
        priceAdult: '',
      });
      loadTrips();
    } catch (err) {
      setError('Error al crear el viaje');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este viaje?')) {
      try {
        await tripService.delete(id);
        loadTrips();
      } catch (err) {
        setError('Error al eliminar el viaje');
        console.error(err);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Viajes</h1>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2"
        >
          + Nuevo Viaje
        </Button>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      {loading ? (
        <Loading />
      ) : trips.length === 0 ? (
        <EmptyState message="No hay viajes registrados" />
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Destino</th>
                <th className="px-6 py-4 text-left font-semibold">Salida</th>
                <th className="px-6 py-4 text-left font-semibold">Regreso</th>
                <th className="px-6 py-4 text-left font-semibold">Precio Adulto</th>
                <th className="px-6 py-4 text-left font-semibold">Estado</th>
                <th className="px-6 py-4 text-left font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {trips.map((trip) => (
                <tr key={trip.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{trip.destination}</td>
                  <td className="px-6 py-4">
                    {new Date(trip.departureDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(trip.returnDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">€{trip.priceAdult}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded text-sm ${
                        trip.status === 'AVAILABLE'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {trip.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <Link
                      to={`/trips/${trip.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Ver
                    </Link>
                    <button
                      onClick={() => handleDelete(trip.id)}
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
        title="Crear Nuevo Viaje"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="destination"
            placeholder="Destino"
            value={formData.destination}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <textarea
            name="description"
            placeholder="Descripción"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="date"
            name="departureDate"
            value={formData.departureDate}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="date"
            name="returnDate"
            value={formData.returnDate}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="number"
            name="priceAdult"
            placeholder="Precio Adulto"
            value={formData.priceAdult}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
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

export default TripsPage;

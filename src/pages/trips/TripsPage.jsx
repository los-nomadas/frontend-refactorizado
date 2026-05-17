import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tripService, hotelService, busService } from '../../api/services';
import { Loading, EmptyState, Alert } from '../../components/common/Feedback';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

const defaultFormData = () => ({
  destination: '',
  description: '',
  departureDate: '',
  returnDate: '',
  hotelId: '',
  busId: '',
  boardType: 'HALF_BOARD',
  priceAdult: '',
  priceChild: '',
  priceSenior: '',
  totalSeats: '',
  availableSeats: '',
  isOffer: false,
  imageUrl: '',
});

const TripsPage = () => {
  const [trips, setTrips] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(defaultFormData());

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

  const openCreateModal = async () => {
    try {
      const [hotelsRes, busesRes] = await Promise.all([
        hotelService.getAll(),
        busService.getAll(),
      ]);
      setHotels(hotelsRes.data || []);
      setBuses(busesRes.data || []);
      setFormData(defaultFormData());
      setIsModalOpen(true);
    } catch (err) {
      setError('No se pudo cargar el catálogo de hoteles y autobuses');
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await tripService.create({
        ...formData,
        hotelId: Number(formData.hotelId),
        busId: Number(formData.busId),
        priceAdult: Number(formData.priceAdult),
        priceChild: Number(formData.priceChild),
        priceSenior: Number(formData.priceSenior),
        totalSeats: Number(formData.totalSeats),
        availableSeats: Number(formData.availableSeats),
      });
      setIsModalOpen(false);
      setFormData(defaultFormData());
      loadTrips();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear el viaje');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este viaje?')) return;
    try {
      await tripService.delete(id);
      loadTrips();
    } catch (err) {
      setError('Error al eliminar el viaje');
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Viajes</h1>
        <Button onClick={openCreateModal}>+ Nuevo viaje</Button>
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
                <th className="px-4 py-3 text-left font-semibold">Destino</th>
                <th className="px-4 py-3 text-left font-semibold">Salida</th>
                <th className="px-4 py-3 text-left font-semibold">Regreso</th>
                <th className="px-4 py-3 text-left font-semibold">Hotel</th>
                <th className="px-4 py-3 text-left font-semibold">Autobús</th>
                <th className="px-4 py-3 text-left font-semibold">Adulto</th>
                <th className="px-4 py-3 text-left font-semibold">Plazas</th>
                <th className="px-4 py-3 text-left font-semibold">Estado</th>
                <th className="px-4 py-3 text-left font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {trips.map((trip) => (
                <tr key={trip.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{trip.destination}</td>
                  <td className="px-4 py-3">{new Date(trip.departureDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{new Date(trip.returnDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{trip.hotelName}</td>
                  <td className="px-4 py-3">{trip.busPlateNumber}</td>
                  <td className="px-4 py-3">€{trip.priceAdult}</td>
                  <td className="px-4 py-3">{trip.availableSeats}/{trip.totalSeats}</td>
                  <td className="px-4 py-3">
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
                  <td className="px-4 py-3 flex gap-3">
                    <Link to={`/trips/${trip.id}`} className="text-blue-600 hover:text-blue-800">
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
        title="Crear nuevo viaje"
      >
        <form onSubmit={handleSubmit} className="space-y-3">
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
            required
          />
          <div className="grid grid-cols-2 gap-3">
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
          </div>
          <div className="grid grid-cols-2 gap-3">
            <select
              name="hotelId"
              value={formData.hotelId}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded"
              required
            >
              <option value="">Hotel</option>
              {hotels.map((hotel) => (
                <option key={hotel.id} value={hotel.id}>
                  {hotel.name}
                </option>
              ))}
            </select>
            <select
              name="busId"
              value={formData.busId}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded"
              required
            >
              <option value="">Autobús</option>
              {buses.map((bus) => (
                <option key={bus.id} value={bus.id}>
                  {bus.plateNumber} ({bus.totalSeats} plazas)
                </option>
              ))}
            </select>
          </div>
          <select
            name="boardType"
            value={formData.boardType}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded"
          >
            <option value="HALF_BOARD">Media pensión</option>
            <option value="FULL_BOARD">Pensión completa</option>
          </select>
          <div className="grid grid-cols-3 gap-3">
            <input
              type="number"
              step="0.01"
              name="priceAdult"
              placeholder="€ adulto"
              value={formData.priceAdult}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
            <input
              type="number"
              step="0.01"
              name="priceChild"
              placeholder="€ niño"
              value={formData.priceChild}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
            <input
              type="number"
              step="0.01"
              name="priceSenior"
              placeholder="€ senior"
              value={formData.priceSenior}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              name="totalSeats"
              placeholder="Plazas totales"
              value={formData.totalSeats}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
            <input
              type="number"
              name="availableSeats"
              placeholder="Plazas disponibles"
              value={formData.availableSeats}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <input
            type="text"
            name="imageUrl"
            placeholder="URL de la imagen"
            value={formData.imageUrl}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isOffer"
              checked={formData.isOffer}
              onChange={handleInputChange}
            />
            Destacar como oferta en la home
          </label>
          <div className="flex gap-2 pt-2">
            <Button type="submit" variant="success">
              Crear
            </Button>
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TripsPage;

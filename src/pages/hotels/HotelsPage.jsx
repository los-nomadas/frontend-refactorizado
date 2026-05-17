import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { hotelService } from '../../api/services';
import { Loading, EmptyState, Alert } from '../../components/common/Feedback';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

const HotelsPage = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    totalRooms: '',
    totalPlaces: '',
    halfBoardPrice: '',
    fullBoardPrice: '',
  });

  useEffect(() => {
    loadHotels();
  }, []);

  const loadHotels = async () => {
    try {
      setLoading(true);
      const response = await hotelService.getAll();
      setHotels(response.data || []);
    } catch (err) {
      setError('Error al cargar hoteles');
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
      await hotelService.create(formData);
      setIsModalOpen(false);
      setFormData({
        name: '',
        description: '',
        location: '',
        totalRooms: '',
        totalPlaces: '',
        halfBoardPrice: '',
        fullBoardPrice: '',
      });
      loadHotels();
    } catch (err) {
      setError('Error al crear hotel');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este hotel?')) {
      try {
        await hotelService.delete(id);
        loadHotels();
      } catch (err) {
        setError('Error al eliminar hotel');
        console.error(err);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Hoteles</h1>
        <Button onClick={() => setIsModalOpen(true)}>+ Nuevo Hotel</Button>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      {loading ? (
        <Loading />
      ) : hotels.length === 0 ? (
        <EmptyState message="No hay hoteles registrados" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel) => (
            <div
              key={hotel.id}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
            >
              <h3 className="text-xl font-bold mb-2">{hotel.name}</h3>
              <p className="text-gray-600 mb-3">{hotel.description}</p>
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <p><span className="font-semibold">Ubicación:</span> {hotel.location}</p>
                <p><span className="font-semibold">Habitaciones:</span> {hotel.totalRooms}</p>
                <p><span className="font-semibold">Plazas:</span> {hotel.totalPlaces}</p>
                <p><span className="font-semibold">Media Pensión:</span> €{hotel.halfBoardPrice}</p>
                <p><span className="font-semibold">Pensión Completa:</span> €{hotel.fullBoardPrice}</p>
              </div>
              <div className="flex gap-2">
                <Link
                  to={`/hotels/${hotel.id}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Ver
                </Link>
                <button
                  onClick={() => handleDelete(hotel.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Crear Nuevo Hotel"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            value={formData.name}
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
            type="text"
            name="location"
            placeholder="Ubicación"
            value={formData.location}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="number"
            name="totalRooms"
            placeholder="Número de Habitaciones"
            value={formData.totalRooms}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="number"
            name="totalPlaces"
            placeholder="Total de Plazas"
            value={formData.totalPlaces}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="number"
            name="halfBoardPrice"
            placeholder="Precio Media Pensión"
            value={formData.halfBoardPrice}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="number"
            name="fullBoardPrice"
            placeholder="Precio Pensión Completa"
            value={formData.fullBoardPrice}
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

export default HotelsPage;

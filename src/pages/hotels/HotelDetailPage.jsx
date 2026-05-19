import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { hotelService } from '../../api/services';
import { Loading, Alert } from '../../components/common/Feedback';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

const HotelDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState({});

  const loadHotel = async () => {
    try {
      setLoading(true);
      const response = await hotelService.getById(id);
      setHotel(response.data);
      setFormData(response.data);
    } catch (err) {
      setError('Error al cargar el hotel');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHotel();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await hotelService.update(id, formData);
      setHotel(formData);
      setIsEditOpen(false);
      setError(null);
      alert('Hotel actualizado correctamente');
    } catch (err) {
      setError('Error al actualizar hotel');
      console.error(err);
    }
  };

  if (loading) return <Loading />;

  if (!hotel) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-600">Hotel no encontrado</p>
        <Button onClick={() => navigate('/hotels')} className="mt-4">
          Volver a Hoteles
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button onClick={() => navigate('/hotels')} variant="secondary" className="mb-6">
        ← Volver a Hoteles
      </Button>

      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold mb-2">{hotel.name}</h1>
        <p className="text-gray-600 mb-8">{hotel.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="border rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4">Información del Hotel</h2>
            <div className="space-y-3 text-gray-700">
              <p><span className="font-semibold">Ubicación:</span> {hotel.location}</p>
              <p><span className="font-semibold">Habitaciones:</span> {hotel.totalRooms}</p>
              <p><span className="font-semibold">Plazas Disponibles:</span> {hotel.availablePlaces} / {hotel.totalPlaces}</p>
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4">Tarifas</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                <span className="font-semibold">Media Pensión:</span> €{hotel.halfBoardPrice}
              </p>
              <p>
                <span className="font-semibold">Pensión Completa:</span> €{hotel.fullBoardPrice}
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={() => setIsEditOpen(true)}
          variant="primary"
        >
          Editar Hotel
        </Button>
      </div>

      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Editar Hotel"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            value={formData.name || ''}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <textarea
            name="description"
            placeholder="Descripción"
            value={formData.description || ''}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="text"
            name="location"
            placeholder="Ubicación"
            value={formData.location || ''}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="number"
            name="totalRooms"
            placeholder="Habitaciones"
            value={formData.totalRooms || ''}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="number"
            name="totalPlaces"
            placeholder="Total Plazas"
            value={formData.totalPlaces || ''}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="number"
            name="halfBoardPrice"
            placeholder="Precio Media Pensión"
            value={formData.halfBoardPrice || ''}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="number"
            name="fullBoardPrice"
            placeholder="Precio Pensión Completa"
            value={formData.fullBoardPrice || ''}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <div className="flex gap-2 pt-4">
            <Button type="submit" variant="success">
              Guardar
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsEditOpen(false)}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default HotelDetailPage;

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

  const inputClass =
    'w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100';

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

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-10rem)] bg-primary-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <Loading />
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-[calc(100vh-10rem)] bg-primary-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <p className="text-gray-600">Hotel no encontrado</p>
          <Button onClick={() => navigate('/hotels')} className="mt-4 rounded-md">
            Volver a Hoteles
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-10rem)] bg-primary-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <Button onClick={() => navigate('/hotels')} variant="secondary" className="rounded-md">
            ← Volver a Hoteles
          </Button>
        </div>

        {error && (
          <div className="mb-6">
            <Alert type="error" message={error} onClose={() => setError(null)} />
          </div>
        )}

        <div className="mb-6 rounded-xl border border-primary-100 bg-white px-6 py-5 shadow-sm">
          <p className="text-sm font-semibold text-primary-700">Detalle de hotel</p>
          <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-950">{hotel.name}</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">{hotel.description}</p>
            </div>
            <Button onClick={() => setIsEditOpen(true)} variant="primary" className="self-start rounded-md sm:self-auto">
              Editar Hotel
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-950">Información del Hotel</h2>
            <div className="mt-6 grid grid-cols-1 gap-4">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase text-gray-500">Ubicación</p>
                <p className="mt-1 text-base font-semibold text-gray-950">{hotel.location}</p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <p className="text-xs font-semibold uppercase text-gray-500">Habitaciones</p>
                  <p className="mt-1 text-base font-semibold text-gray-950">{hotel.totalRooms}</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <p className="text-xs font-semibold uppercase text-gray-500">Plazas Disponibles</p>
                  <p className="mt-1 text-base font-semibold text-gray-950">
                    {hotel.availablePlaces} / {hotel.totalPlaces}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-950">Tarifas</h2>
            <div className="mt-6 grid grid-cols-1 gap-4">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase text-gray-500">Media Pensión</p>
                <p className="mt-1 text-2xl font-bold text-primary-700">€{hotel.halfBoardPrice}</p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase text-gray-500">Pensión Completa</p>
                <p className="mt-1 text-2xl font-bold text-primary-700">€{hotel.fullBoardPrice}</p>
              </div>
            </div>
          </div>
        </div>
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
            className={inputClass}
            required
          />
          <textarea
            name="description"
            placeholder="Descripción"
            value={formData.description || ''}
            onChange={handleInputChange}
            className={`${inputClass} min-h-28`}
          />
          <input
            type="text"
            name="location"
            placeholder="Ubicación"
            value={formData.location || ''}
            onChange={handleInputChange}
            className={inputClass}
            required
          />
          <input
            type="number"
            name="totalRooms"
            placeholder="Habitaciones"
            value={formData.totalRooms || ''}
            onChange={handleInputChange}
            className={inputClass}
            required
          />
          <input
            type="number"
            name="totalPlaces"
            placeholder="Total Plazas"
            value={formData.totalPlaces || ''}
            onChange={handleInputChange}
            className={inputClass}
            required
          />
          <input
            type="number"
            name="halfBoardPrice"
            placeholder="Precio Media Pensión"
            value={formData.halfBoardPrice || ''}
            onChange={handleInputChange}
            className={inputClass}
            required
          />
          <input
            type="number"
            name="fullBoardPrice"
            placeholder="Precio Pensión Completa"
            value={formData.fullBoardPrice || ''}
            onChange={handleInputChange}
            className={inputClass}
            required
          />
          <div className="flex flex-col gap-2 pt-4 sm:flex-row">
            <Button type="submit" variant="primary" className="rounded-md">
              Guardar
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsEditOpen(false)}
              className="rounded-md"
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

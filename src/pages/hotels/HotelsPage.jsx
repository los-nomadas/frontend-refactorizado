import { useEffect, useState } from 'react';
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

  const inputClass =
    'w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100';

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

  useEffect(() => {
    loadHotels();
  }, []);

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
    <div className="min-h-[calc(100vh-10rem)] bg-primary-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 rounded-xl border border-primary-100 bg-white px-6 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-primary-700">Gestión</p>
            <h1 className="mt-1 text-3xl font-bold text-gray-950">Hoteles</h1>
            <p className="mt-2 text-sm text-gray-600">
              Gestiona alojamientos, capacidad y tarifas disponibles.
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="self-start rounded-md sm:self-center">
            + Nuevo Hotel
          </Button>
        </div>

        {error && (
          <div className="mb-6">
            <Alert type="error" message={error} onClose={() => setError(null)} />
          </div>
        )}

        {loading ? (
          <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
            <Loading />
          </div>
        ) : hotels.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
            <EmptyState message="No hay hoteles registrados" />
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-primary-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Hotel</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Ubicación</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Habitaciones</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Plazas</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Media Pensión</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Pensión Completa</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {hotels.map((hotel) => (
                    <tr key={hotel.id} className="transition-colors hover:bg-primary-50">
                      <td className="min-w-64 px-6 py-4">
                        <p className="text-sm font-semibold text-gray-950">{hotel.name}</p>
                        <p className="mt-1 line-clamp-2 text-sm text-gray-500">{hotel.description}</p>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{hotel.location}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{hotel.totalRooms}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{hotel.totalPlaces}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800">
                        €{hotel.halfBoardPrice}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800">
                        €{hotel.fullBoardPrice}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-3 text-sm font-semibold">
                          <Link
                            to={`/hotels/${hotel.id}`}
                            className="text-primary-700 transition-colors hover:text-primary-900"
                          >
                            Ver
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(hotel.id)}
                            className="text-danger-600 transition-colors hover:text-danger-700"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

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
            className={inputClass}
            required
          />
          <textarea
            name="description"
            placeholder="Descripción"
            value={formData.description}
            onChange={handleInputChange}
            className={`${inputClass} min-h-28`}
          />
          <input
            type="text"
            name="location"
            placeholder="Ubicación"
            value={formData.location}
            onChange={handleInputChange}
            className={inputClass}
            required
          />
          <input
            type="number"
            name="totalRooms"
            placeholder="Número de Habitaciones"
            value={formData.totalRooms}
            onChange={handleInputChange}
            className={inputClass}
            required
          />
          <input
            type="number"
            name="totalPlaces"
            placeholder="Total de Plazas"
            value={formData.totalPlaces}
            onChange={handleInputChange}
            className={inputClass}
            required
          />
          <input
            type="number"
            name="halfBoardPrice"
            placeholder="Precio Media Pensión"
            value={formData.halfBoardPrice}
            onChange={handleInputChange}
            className={inputClass}
            required
          />
          <input
            type="number"
            name="fullBoardPrice"
            placeholder="Precio Pensión Completa"
            value={formData.fullBoardPrice}
            onChange={handleInputChange}
            className={inputClass}
            required
          />
          <div className="flex flex-col gap-2 pt-4 sm:flex-row">
            <Button type="submit" variant="primary" className="rounded-md">
              Crear
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
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

export default HotelsPage;

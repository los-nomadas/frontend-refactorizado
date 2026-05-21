import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { busService, driverService } from '../../api/services';
import { Loading, EmptyState, Alert } from '../../components/common/Feedback';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { validateBusForm } from '../../utils/validation';

const BusesPage = () => {
  const [buses, setBuses] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    plateNumber: '',
    totalSeats: '',
    availableSeats: '',
    driverId: '',
  });

  const inputClass =
    'w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100';
  const fieldErrorClass = 'mt-1 text-sm font-medium text-danger-600';

  const loadData = async () => {
    try {
      setLoading(true);
      const [busesRes, driversRes] = await Promise.all([
        busService.getAll(),
        driverService.getAll(),
      ]);
      setBuses(busesRes.data || []);
      setDrivers(driversRes.data || []);
    } catch (err) {
      setError('Error al cargar datos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateBusForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    const payload = {
      plateNumber: formData.plateNumber,
      totalSeats: Number(formData.totalSeats),
      availableSeats: Number(formData.availableSeats),
      driverId: Number(formData.driverId),
    };

    try {
      await busService.create(payload);
      setIsModalOpen(false);
      setFormData({ plateNumber: '', totalSeats: '', availableSeats: '', driverId: '' });
      setFormErrors({});
      loadData();
    } catch (err) {
      setError('Error al crear autobús');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este autobús?')) {
      try {
        await busService.delete(id);
        loadData();
      } catch (err) {
        setError('Error al eliminar autobús');
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
            <h1 className="mt-1 text-3xl font-bold text-gray-950">Autobuses</h1>
            <p className="mt-2 text-sm text-gray-600">
              Controla matrículas, capacidad y conductor asignado.
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="self-start rounded-md sm:self-center">
            + Nuevo Autobús
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
        ) : buses.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
            <EmptyState message="No hay autobuses registrados" />
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-primary-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Matrícula</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Asientos</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Conductor</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {buses.map((bus) => (
                    <tr key={bus.id} className="transition-colors hover:bg-primary-50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-950">
                        {bus.plateNumber}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                          {bus.availableSeats ?? 'N/A'} / {bus.totalSeats}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                        {bus.driverFullName || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-3 text-sm font-semibold">
                          <Link
                            to={`/buses/${bus.id}`}
                            className="text-primary-700 transition-colors hover:text-primary-900"
                          >
                            Ver
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(bus.id)}
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
        title="Crear Nuevo Autobús"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="plateNumber"
              placeholder="Matrícula"
              value={formData.plateNumber}
              onChange={handleInputChange}
              className={inputClass}
              required
            />
            {formErrors.plateNumber && <p className={fieldErrorClass}>{formErrors.plateNumber}</p>}
          </div>
          <div>
            <input
              type="number"
              name="totalSeats"
              placeholder="Número de Asientos"
              value={formData.totalSeats}
              onChange={handleInputChange}
              className={inputClass}
              required
            />
            {formErrors.totalSeats && <p className={fieldErrorClass}>{formErrors.totalSeats}</p>}
          </div>
          <div>
            <input
              type="number"
              name="availableSeats"
              placeholder="Asientos Disponibles"
              value={formData.availableSeats}
              onChange={handleInputChange}
              className={inputClass}
              required
            />
            {formErrors.availableSeats && <p className={fieldErrorClass}>{formErrors.availableSeats}</p>}
          </div>
          <div>
            <select
              name="driverId"
              value={formData.driverId}
              onChange={handleInputChange}
              className={inputClass}
              required
            >
              <option value="">Seleccionar Conductor</option>
              {drivers.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {`${driver.firstName} ${driver.lastName}`}
                </option>
              ))}
            </select>
            {formErrors.driverId && <p className={fieldErrorClass}>{formErrors.driverId}</p>}
          </div>
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

export default BusesPage;

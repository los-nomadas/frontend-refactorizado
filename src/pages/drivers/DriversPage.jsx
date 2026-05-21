import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { driverService } from '../../api/services';
import { Loading, EmptyState, Alert } from '../../components/common/Feedback';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { validateDriverForm } from '../../utils/validation';

const DriversPage = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dni: '',
    licenseNumber: '',
    phone: '',
    email: '',
    available: true,
  });

  const inputClass =
    'w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100';
  const fieldErrorClass = 'mt-1 text-sm font-medium text-danger-600';

  const loadDrivers = async () => {
    try {
      setLoading(true);
      const response = await driverService.getAll();
      setDrivers(response.data || []);
    } catch (err) {
      setError('Error al cargar conductores');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDrivers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setFormErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      dni: formData.dni,
      licenseNumber: formData.licenseNumber,
      phone: formData.phone,
      email: formData.email,
      available: formData.available,
    };
    const validationErrors = validateDriverForm(payload);

    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    try {
      await driverService.create(payload);
      setIsModalOpen(false);
      setFormData({
        firstName: '',
        lastName: '',
        dni: '',
        licenseNumber: '',
        phone: '',
        email: '',
        available: true,
      });
      setFormErrors({});
      loadDrivers();
    } catch (err) {
      setError('Error al crear conductor');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este conductor?')) {
      try {
        await driverService.delete(id);
        loadDrivers();
      } catch (err) {
        setError('Error al eliminar conductor');
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
            <h1 className="mt-1 text-3xl font-bold text-gray-950">Conductores</h1>
            <p className="mt-2 text-sm text-gray-600">
              Administra licencias, contacto y disponibilidad del equipo.
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="self-start rounded-md sm:self-center">
            + Nuevo Conductor
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
        ) : drivers.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
            <EmptyState message="No hay conductores registrados" />
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-primary-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Nombre</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">DNI</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Licencia</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Teléfono</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Disponible</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {drivers.map((driver) => (
                    <tr key={driver.id} className="transition-colors hover:bg-primary-50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-950">
                        {`${driver.firstName} ${driver.lastName}`}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{driver.dni}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{driver.licenseNumber}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{driver.email}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{driver.phone}</td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-sm font-semibold ${
                            driver.available
                              ? 'bg-success-50 text-success-700'
                              : 'bg-danger-50 text-danger-700'
                          }`}
                        >
                          {driver.available ? 'Sí' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-3 text-sm font-semibold">
                          <Link
                            to={`/drivers/${driver.id}`}
                            className="text-primary-700 transition-colors hover:text-primary-900"
                          >
                            Ver
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(driver.id)}
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
        title="Crear Nuevo Conductor"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="firstName"
              placeholder="Nombre"
              value={formData.firstName}
              onChange={handleInputChange}
              className={inputClass}
              required
            />
            {formErrors.firstName && <p className={fieldErrorClass}>{formErrors.firstName}</p>}
          </div>
          <div>
            <input
              type="text"
              name="lastName"
              placeholder="Apellidos"
              value={formData.lastName}
              onChange={handleInputChange}
              className={inputClass}
              required
            />
            {formErrors.lastName && <p className={fieldErrorClass}>{formErrors.lastName}</p>}
          </div>
          <div>
            <input
              type="text"
              name="dni"
              placeholder="DNI"
              value={formData.dni}
              onChange={handleInputChange}
              className={inputClass}
              required
            />
            {formErrors.dni && <p className={fieldErrorClass}>{formErrors.dni}</p>}
          </div>
          <div>
            <input
              type="text"
              name="licenseNumber"
              placeholder="Número de Licencia"
              value={formData.licenseNumber}
              onChange={handleInputChange}
              className={inputClass}
              required
            />
            {formErrors.licenseNumber && <p className={fieldErrorClass}>{formErrors.licenseNumber}</p>}
          </div>
          <div>
            <input
              type="tel"
              name="phone"
              placeholder="Teléfono"
              value={formData.phone}
              onChange={handleInputChange}
              className={inputClass}
            />
            {formErrors.phone && <p className={fieldErrorClass}>{formErrors.phone}</p>}
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className={inputClass}
              required
            />
            {formErrors.email && <p className={fieldErrorClass}>{formErrors.email}</p>}
          </div>
          <label className="flex items-center rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              name="available"
              checked={formData.available}
              onChange={handleInputChange}
              className="mr-3 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
            />
            <span>Disponible</span>
          </label>
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

export default DriversPage;

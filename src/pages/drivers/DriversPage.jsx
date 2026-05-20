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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Conductores</h1>
        <Button onClick={() => setIsModalOpen(true)}>+ Nuevo Conductor</Button>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      {loading ? (
        <Loading />
      ) : drivers.length === 0 ? (
        <EmptyState message="No hay conductores registrados" />
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Nombre</th>
                <th className="px-6 py-4 text-left font-semibold">DNI</th>
                <th className="px-6 py-4 text-left font-semibold">Licencia</th>
                <th className="px-6 py-4 text-left font-semibold">Email</th>
                <th className="px-6 py-4 text-left font-semibold">Teléfono</th>
                <th className="px-6 py-4 text-left font-semibold">Disponible</th>
                <th className="px-6 py-4 text-left font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((driver) => (
                <tr key={driver.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{`${driver.firstName} ${driver.lastName}`}</td>
                  <td className="px-6 py-4">{driver.dni}</td>
                  <td className="px-6 py-4">{driver.licenseNumber}</td>
                  <td className="px-6 py-4">{driver.email}</td>
                  <td className="px-6 py-4">{driver.phone}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded text-sm ${
                        driver.available
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {driver.available ? 'Sí' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <Link
                      to={`/drivers/${driver.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Ver
                    </Link>
                    <button
                      onClick={() => handleDelete(driver.id)}
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
        title="Crear Nuevo Conductor"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="firstName"
            placeholder="Nombre"
            value={formData.firstName}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
          {formErrors.firstName && <p className="text-sm text-red-600">{formErrors.firstName}</p>}
          <input
            type="text"
            name="lastName"
            placeholder="Apellidos"
            value={formData.lastName}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
          {formErrors.lastName && <p className="text-sm text-red-600">{formErrors.lastName}</p>}
          <input
            type="text"
            name="dni"
            placeholder="DNI"
            value={formData.dni}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
          {formErrors.dni && <p className="text-sm text-red-600">{formErrors.dni}</p>}
          <input
            type="text"
            name="licenseNumber"
            placeholder="Número de Licencia"
            value={formData.licenseNumber}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
          {formErrors.licenseNumber && <p className="text-sm text-red-600">{formErrors.licenseNumber}</p>}
          <input
            type="tel"
            name="phone"
            placeholder="Teléfono"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded"
          />
          {formErrors.phone && <p className="text-sm text-red-600">{formErrors.phone}</p>}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
          {formErrors.email && <p className="text-sm text-red-600">{formErrors.email}</p>}
          <label className="flex items-center">
            <input
              type="checkbox"
              name="available"
              checked={formData.available}
              onChange={handleInputChange}
              className="mr-2"
            />
            <span>Disponible</span>
          </label>
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

export default DriversPage;

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { driverService } from '../../api/services';
import { Loading, Alert } from '../../components/common/Feedback';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { validateDriverForm } from '../../utils/validation';

const DriverDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState({});

  const inputClass =
    'w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100';
  const fieldErrorClass = 'mt-1 text-sm font-medium text-danger-600';

  const loadDriver = async () => {
    try {
      setLoading(true);
      const response = await driverService.getById(id);
      setDriver(response.data);
      setFormData({
        firstName: response.data.firstName || '',
        lastName: response.data.lastName || '',
        dni: response.data.dni || '',
        licenseNumber: response.data.licenseNumber || '',
        phone: response.data.phone || '',
        email: response.data.email || '',
        available: response.data.available || false,
      });
    } catch (err) {
      setError('Error al cargar el conductor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDriver();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setFormErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSave = async (e) => {
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
      await driverService.update(id, payload);
      setDriver({ ...driver, ...payload });
      setIsEditOpen(false);
      setFormErrors({});
      setError(null);
      alert('Conductor actualizado correctamente');
    } catch (err) {
      setError('Error al actualizar conductor');
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

  if (!driver) {
    return (
      <div className="min-h-[calc(100vh-10rem)] bg-primary-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <p className="text-gray-600">Conductor no encontrado</p>
          <Button onClick={() => navigate('/drivers')} className="mt-4 rounded-md">
            Volver a Conductores
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-10rem)] bg-primary-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <Button onClick={() => navigate('/drivers')} variant="secondary" className="rounded-md">
            ← Volver a Conductores
          </Button>
        </div>

        {error && (
          <div className="mb-6">
            <Alert type="error" message={error} onClose={() => setError(null)} />
          </div>
        )}

        <div className="mb-6 rounded-xl border border-primary-100 bg-white px-6 py-5 shadow-sm">
          <p className="text-sm font-semibold text-primary-700">Detalle de conductor</p>
          <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-950">
                {driver.firstName} {driver.lastName}
              </h1>
              <p className="mt-2 text-sm text-gray-600">{driver.dni}</p>
            </div>
            <Button onClick={() => setIsEditOpen(true)} variant="primary" className="self-start rounded-md sm:self-auto">
              Editar Conductor
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-bold text-gray-950">Información Personal</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase text-gray-500">DNI</p>
              <p className="mt-1 text-base font-semibold text-gray-950">{driver.dni}</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase text-gray-500">Licencia</p>
              <p className="mt-1 text-base font-semibold text-gray-950">{driver.licenseNumber}</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase text-gray-500">Teléfono</p>
              <p className="mt-1 text-base font-semibold text-gray-950">{driver.phone}</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase text-gray-500">Email</p>
              <p className="mt-1 text-base font-semibold text-gray-950">{driver.email}</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase text-gray-500">Disponibilidad</p>
              <span
                className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                  driver.available
                    ? 'bg-success-50 text-success-700'
                    : 'bg-danger-50 text-danger-700'
                }`}
              >
                {driver.available ? 'Disponible' : 'No Disponible'}
              </span>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase text-gray-500">ID</p>
              <p className="mt-1 text-base font-semibold text-gray-950">{driver.id}</p>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Editar Conductor"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <input
              type="text"
              name="firstName"
              placeholder="Nombre"
              value={formData.firstName || ''}
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
              value={formData.lastName || ''}
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
              value={formData.dni || ''}
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
              value={formData.licenseNumber || ''}
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
              value={formData.phone || ''}
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
              value={formData.email || ''}
              onChange={handleInputChange}
              className={inputClass}
              required
            />
            {formErrors.email && <p className={fieldErrorClass}>{formErrors.email}</p>}
          </div>
          <label className="flex cursor-pointer items-center gap-3 rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              name="available"
              checked={formData.available || false}
              onChange={handleInputChange}
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
            />
            <span>Disponible para viajes</span>
          </label>
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

export default DriverDetailPage;

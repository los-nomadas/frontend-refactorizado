import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { busService, driverService } from '../../api/services';
import { Loading, Alert } from '../../components/common/Feedback';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { validateBusForm } from '../../utils/validation';

const BusDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bus, setBus] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState({});

  const inputClass =
    'w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100';
  const fieldErrorClass = 'mt-1 text-sm font-medium text-danger-600';

  const loadBus = async () => {
    try {
      setLoading(true);
      const response = await busService.getById(id);
      setBus(response.data);
      setFormData({
        plateNumber: response.data.plateNumber || '',
        totalSeats: response.data.totalSeats || '',
        availableSeats: response.data.availableSeats ?? '',
        driverId: response.data.driverId || '',
      });
    } catch (err) {
      setError('Error al cargar el autobús');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadDrivers = async () => {
    try {
      const response = await driverService.getAll();
      setDrivers(response.data || []);
    } catch (err) {
      console.error('Error al cargar conductores:', err);
    }
  };

  useEffect(() => {
    loadBus();
    loadDrivers();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSave = async (e) => {
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
      await busService.update(id, payload);
      const selectedDriver = drivers.find((driver) => String(driver.id) === String(payload.driverId));
      setBus({
        ...bus,
        ...payload,
        driverFullName: selectedDriver
          ? `${selectedDriver.firstName} ${selectedDriver.lastName}`
          : bus.driverFullName,
      });
      setIsEditOpen(false);
      setFormErrors({});
      setError(null);
      alert('Autobús actualizado correctamente');
    } catch (err) {
      setError('Error al actualizar autobús');
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

  if (!bus) {
    return (
      <div className="min-h-[calc(100vh-10rem)] bg-primary-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <p className="text-gray-600">Autobús no encontrado</p>
          <Button onClick={() => navigate('/buses')} className="mt-4 rounded-md">
            Volver a Autobuses
          </Button>
        </div>
      </div>
    );
  }

  const assignedDriver = drivers.find((driver) => String(driver.id) === String(bus.driverId));
  const driverFullName = bus.driverFullName || (
    assignedDriver ? `${assignedDriver.firstName} ${assignedDriver.lastName}` : null
  );

  return (
    <div className="min-h-[calc(100vh-10rem)] bg-primary-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <Button onClick={() => navigate('/buses')} variant="secondary" className="rounded-md">
            ← Volver a Autobuses
          </Button>
        </div>

        {error && (
          <div className="mb-6">
            <Alert type="error" message={error} onClose={() => setError(null)} />
          </div>
        )}

        <div className="mb-6 rounded-xl border border-primary-100 bg-white px-6 py-5 shadow-sm">
          <p className="text-sm font-semibold text-primary-700">Detalle de autobús</p>
          <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-950">{bus.plateNumber}</h1>
              <p className="mt-2 text-sm text-gray-600">
                {bus.availableSeats ?? 'N/A'} / {bus.totalSeats} asientos disponibles
              </p>
            </div>
            <Button onClick={() => setIsEditOpen(true)} variant="primary" className="self-start rounded-md sm:self-auto">
              Editar Autobús
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-950">Información del Autobús</h2>
            <div className="mt-6 grid grid-cols-1 gap-4">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase text-gray-500">Matrícula</p>
                <p className="mt-1 text-base font-semibold text-gray-950">{bus.plateNumber}</p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <p className="text-xs font-semibold uppercase text-gray-500">Asientos Totales</p>
                  <p className="mt-1 text-base font-semibold text-gray-950">{bus.totalSeats}</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <p className="text-xs font-semibold uppercase text-gray-500">Asientos Disponibles</p>
                  <p className="mt-1 text-base font-semibold text-gray-950">{bus.availableSeats ?? 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-950">Conductor Asignado</h2>
            {driverFullName ? (
              <div className="mt-6 grid grid-cols-1 gap-4">
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <p className="text-xs font-semibold uppercase text-gray-500">Nombre</p>
                  <p className="mt-1 text-base font-semibold text-gray-950">{driverFullName}</p>
                </div>
                {assignedDriver && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <p className="text-xs font-semibold uppercase text-gray-500">DNI</p>
                      <p className="mt-1 text-base font-semibold text-gray-950">{assignedDriver.dni}</p>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <p className="text-xs font-semibold uppercase text-gray-500">Teléfono</p>
                      <p className="mt-1 text-base font-semibold text-gray-950">{assignedDriver.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="mt-6 rounded-lg border border-warning-50 bg-warning-50 p-4 text-sm font-semibold text-warning-700">
                Sin conductor asignado
              </p>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Editar Autobús"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <input
              type="text"
              name="plateNumber"
              placeholder="Matrícula"
              value={formData.plateNumber || ''}
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
              placeholder="Asientos Totales"
              value={formData.totalSeats || ''}
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
              value={formData.availableSeats ?? ''}
              onChange={handleInputChange}
              className={inputClass}
              required
            />
            {formErrors.availableSeats && <p className={fieldErrorClass}>{formErrors.availableSeats}</p>}
          </div>
          <select
            name="driverId"
            value={formData.driverId || ''}
            onChange={handleInputChange}
            className={inputClass}
          >
            <option value="">Seleccionar conductor</option>
            {drivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.firstName} {driver.lastName}
              </option>
            ))}
          </select>
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

export default BusDetailPage;

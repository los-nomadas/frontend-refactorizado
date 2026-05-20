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

  if (loading) return <Loading />;

  if (!bus) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-600">Autobús no encontrado</p>
        <Button onClick={() => navigate('/buses')} className="mt-4">
          Volver a Autobuses
        </Button>
      </div>
    );
  }

  const assignedDriver = drivers.find((driver) => String(driver.id) === String(bus.driverId));
  const driverFullName = bus.driverFullName || (
    assignedDriver ? `${assignedDriver.firstName} ${assignedDriver.lastName}` : null
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <Button onClick={() => navigate('/buses')} variant="secondary" className="mb-6">
        ← Volver a Autobuses
      </Button>

      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold mb-2">{bus.plateNumber}</h1>
        <p className="text-gray-600 mb-8">
          {bus.availableSeats ?? 'N/A'} / {bus.totalSeats} asientos disponibles
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="border rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4">Información del Autobús</h2>
            <div className="space-y-3 text-gray-700">
              <p><span className="font-semibold">Matrícula:</span> {bus.plateNumber}</p>
              <p><span className="font-semibold">Asientos Totales:</span> {bus.totalSeats}</p>
              <p><span className="font-semibold">Asientos Disponibles:</span> {bus.availableSeats ?? 'N/A'}</p>
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4">Conductor Asignado</h2>
            {driverFullName ? (
              <div className="space-y-3 text-gray-700">
                <p>
                  <span className="font-semibold">Nombre:</span> {driverFullName}
                </p>
                {assignedDriver && <p><span className="font-semibold">DNI:</span> {assignedDriver.dni}</p>}
                {assignedDriver && <p><span className="font-semibold">Teléfono:</span> {assignedDriver.phone}</p>}
              </div>
            ) : (
              <p className="text-yellow-600">Sin conductor asignado</p>
            )}
          </div>
        </div>

        <Button
          onClick={() => setIsEditOpen(true)}
          variant="primary"
        >
          Editar Autobús
        </Button>
      </div>

      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Editar Autobús"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <input
            type="text"
            name="plateNumber"
            placeholder="Matrícula"
            value={formData.plateNumber || ''}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
          {formErrors.plateNumber && <p className="text-sm text-red-600">{formErrors.plateNumber}</p>}
          <input
            type="number"
            name="totalSeats"
            placeholder="Asientos Totales"
            value={formData.totalSeats || ''}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
          {formErrors.totalSeats && <p className="text-sm text-red-600">{formErrors.totalSeats}</p>}
          <input
            type="number"
            name="availableSeats"
            placeholder="Asientos Disponibles"
            value={formData.availableSeats ?? ''}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
          {formErrors.availableSeats && <p className="text-sm text-red-600">{formErrors.availableSeats}</p>}
          <select
            name="driverId"
            value={formData.driverId || ''}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded"
          >
            <option value="">Seleccionar conductor</option>
            {drivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.firstName} {driver.lastName}
              </option>
            ))}
          </select>
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

export default BusDetailPage;

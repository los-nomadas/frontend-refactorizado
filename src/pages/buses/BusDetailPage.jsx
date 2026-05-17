import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { busService, driverService } from '../../api/services';
import { Loading, Alert } from '../../components/common/Feedback';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

const BusDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bus, setBus] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadBus();
    loadDrivers();
  }, [id]);

  const loadBus = async () => {
    try {
      setLoading(true);
      const response = await busService.getById(id);
      setBus(response.data);
      setFormData(response.data);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await busService.update(id, formData);
      setBus(formData);
      setIsEditOpen(false);
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

  const assignedDriver = drivers.find(d => d.id === bus.driverId);

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
        <p className="text-gray-600 mb-8">{bus.model || 'Modelo no especificado'}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="border rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4">Información del Autobús</h2>
            <div className="space-y-3 text-gray-700">
              <p><span className="font-semibold">Matrícula:</span> {bus.plateNumber}</p>
              <p><span className="font-semibold">Modelo:</span> {bus.model}</p>
              <p><span className="font-semibold">Capacidad:</span> {bus.capacity} pasajeros</p>
              <p><span className="font-semibold">Año:</span> {bus.yearManufactured}</p>
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4">Conductor Asignado</h2>
            {assignedDriver ? (
              <div className="space-y-3 text-gray-700">
                <p>
                  <span className="font-semibold">Nombre:</span> {assignedDriver.firstName}{' '}
                  {assignedDriver.lastName}
                </p>
                <p><span className="font-semibold">DNI:</span> {assignedDriver.dni}</p>
                <p><span className="font-semibold">Teléfono:</span> {assignedDriver.phone}</p>
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
          <input
            type="text"
            name="model"
            placeholder="Modelo"
            value={formData.model || ''}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="number"
            name="capacity"
            placeholder="Capacidad"
            value={formData.capacity || ''}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="number"
            name="yearManufactured"
            placeholder="Año de Fabricación"
            value={formData.yearManufactured || ''}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded"
          />
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

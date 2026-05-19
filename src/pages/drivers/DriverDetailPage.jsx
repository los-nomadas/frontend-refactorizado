import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { driverService } from '../../api/services';
import { Loading, Alert } from '../../components/common/Feedback';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

const DriverDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState({});

  const loadDriver = async () => {
    try {
      setLoading(true);
      const response = await driverService.getById(id);
      setDriver(response.data);
      setFormData(response.data);
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
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await driverService.update(id, formData);
      setDriver(formData);
      setIsEditOpen(false);
      setError(null);
      alert('Conductor actualizado correctamente');
    } catch (err) {
      setError('Error al actualizar conductor');
      console.error(err);
    }
  };

  if (loading) return <Loading />;

  if (!driver) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-600">Conductor no encontrado</p>
        <Button onClick={() => navigate('/drivers')} className="mt-4">
          Volver a Conductores
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button onClick={() => navigate('/drivers')} variant="secondary" className="mb-6">
        ← Volver a Conductores
      </Button>

      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold mb-2">
          {driver.firstName} {driver.lastName}
        </h1>
        <p className="text-gray-600 mb-8">{driver.dni}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="border rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4">Información Personal</h2>
            <div className="space-y-3 text-gray-700">
              <p><span className="font-semibold">DNI:</span> {driver.dni}</p>
              <p><span className="font-semibold">Licencia:</span> {driver.licenseNumber}</p>
              <p><span className="font-semibold">Teléfono:</span> {driver.phone}</p>
              <p>
                <span className="font-semibold">Disponibilidad:</span>{' '}
                <span
                  className={
                    driver.available
                      ? 'text-green-600 font-semibold'
                      : 'text-red-600 font-semibold'
                  }
                >
                  {driver.available ? 'Disponible' : 'No Disponible'}
                </span>
              </p>
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4">Estadísticas</h2>
            <div className="space-y-3 text-gray-700">
              <p><span className="font-semibold">ID:</span> {driver.id}</p>
              <p><span className="font-semibold">Estado:</span> Activo</p>
              <p><span className="font-semibold">Viajes:</span> -</p>
            </div>
          </div>
        </div>

        <Button
          onClick={() => setIsEditOpen(true)}
          variant="primary"
        >
          Editar Conductor
        </Button>
      </div>

      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Editar Conductor"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <input
            type="text"
            name="firstName"
            placeholder="Nombre"
            value={formData.firstName || ''}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Apellidos"
            value={formData.lastName || ''}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="text"
            name="dni"
            placeholder="DNI"
            value={formData.dni || ''}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="text"
            name="licenseNumber"
            placeholder="Número de Licencia"
            value={formData.licenseNumber || ''}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Teléfono"
            value={formData.phone || ''}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded"
          />
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="available"
              checked={formData.available || false}
              onChange={handleInputChange}
              className="w-4 h-4"
            />
            <span>Disponible para viajes</span>
          </label>
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

export default DriverDetailPage;

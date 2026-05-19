import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { busService, driverService } from '../../api/services';
import { Loading, EmptyState, Alert } from '../../components/common/Feedback';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

const BusesPage = () => {
  const [buses, setBuses] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    plateNumber: '',
    totalSeats: '',
    driverId: '',
  });

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await busService.create(formData);
      setIsModalOpen(false);
      setFormData({ plateNumber: '', totalSeats: '', driverId: '' });
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Autobuses</h1>
        <Button onClick={() => setIsModalOpen(true)}>+ Nuevo Autobús</Button>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      {loading ? (
        <Loading />
      ) : buses.length === 0 ? (
        <EmptyState message="No hay autobuses registrados" />
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Matrícula</th>
                <th className="px-6 py-4 text-left font-semibold">Asientos</th>
                <th className="px-6 py-4 text-left font-semibold">Conductor</th>
                <th className="px-6 py-4 text-left font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {buses.map((bus) => (
                <tr key={bus.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{bus.plateNumber}</td>
                  <td className="px-6 py-4">{bus.totalSeats}</td>
                  <td className="px-6 py-4">{bus.driverFullName || 'N/A'}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <Link
                      to={`/buses/${bus.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Ver
                    </Link>
                    <button
                      onClick={() => handleDelete(bus.id)}
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
        title="Crear Nuevo Autobús"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="plateNumber"
            placeholder="Matrícula"
            value={formData.plateNumber}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="number"
            name="totalSeats"
            placeholder="Número de Asientos"
            value={formData.totalSeats}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <select
            name="driverId"
            value={formData.driverId}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded"
            required
          >
            <option value="">Seleccionar Conductor</option>
            {drivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {`${driver.firstName} ${driver.lastName}`}
              </option>
            ))}
          </select>
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

export default BusesPage;

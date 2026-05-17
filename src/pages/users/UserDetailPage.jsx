import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userService } from '../../api/services';
import { Loading, Alert } from '../../components/common/Feedback';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

const UserDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dni: '',
    email: '',
    phone: '',
    birthDate: '',
  });

  useEffect(() => {
    loadUser();
  }, [id]);

  const loadUser = async () => {
    try {
      setLoading(true);
      const response = await userService.getById(id);
      setUser(response.data);
      setFormData(response.data);
    } catch (err) {
      setError('Error al cargar el usuario');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await userService.update(id, formData);
      setUser(formData);
      setIsEditOpen(false);
      setError(null);
      alert('Usuario actualizado correctamente');
    } catch (err) {
      setError('Error al actualizar usuario');
      console.error(err);
    }
  };

  if (loading) return <Loading />;

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-600">Usuario no encontrado</p>
        <Button onClick={() => navigate('/users')} className="mt-4">
          Volver a Usuarios
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button onClick={() => navigate('/users')} variant="secondary" className="mb-6">
        ← Volver a Usuarios
      </Button>

      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-gray-600">{user.email}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="border rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4">Información Personal</h2>
            <div className="space-y-3 text-gray-700">
              <p><span className="font-semibold">DNI:</span> {user.dni}</p>
              <p><span className="font-semibold">Email:</span> {user.email}</p>
              <p><span className="font-semibold">Teléfono:</span> {user.phone}</p>
              <p>
                <span className="font-semibold">Fecha Nacimiento:</span>{' '}
                {new Date(user.birthDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4">Estadísticas</h2>
            <div className="space-y-3 text-gray-700">
              <p><span className="font-semibold">ID:</span> {user.id}</p>
              <p><span className="font-semibold">Estado:</span> Activo</p>
              <p><span className="font-semibold">Fecha Registro:</span> -</p>
            </div>
          </div>
        </div>

        <Button
          onClick={() => setIsEditOpen(true)}
          variant="primary"
        >
          Editar Usuario
        </Button>
      </div>

      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Editar Usuario"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <input
            type="text"
            name="firstName"
            placeholder="Nombre"
            value={formData.firstName}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Apellidos"
            value={formData.lastName}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="text"
            name="dni"
            placeholder="DNI"
            value={formData.dni}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Teléfono"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="date"
            name="birthDate"
            value={formData.birthDate?.split('T')[0] || ''}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
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

export default UserDetailPage;

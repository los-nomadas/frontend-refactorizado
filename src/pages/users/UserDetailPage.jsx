import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userService } from '../../api/services';
import { Loading, Alert } from '../../components/common/Feedback';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import FormField from '../../components/common/FormField';
import { useForm } from '../../hooks/useForm';
import { validateUserForm } from '../../utils/validation';

const UserDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [initialFormData, setInitialFormData] = useState({
    firstName: '',
    lastName: '',
    dni: '',
    email: '',
    phone: '',
    birthDate: '',
  });

  const handleSaveUser = async (formData) => {
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

  const form = useForm(initialFormData, handleSaveUser, validateUserForm);

  useEffect(() => {
    loadUser();
  }, [id]);

  const loadUser = async () => {
    try {
      setLoading(true);
      const response = await userService.getById(id);
      setUser(response.data);
      setInitialFormData(response.data);
      form.setField('firstName', response.data.firstName);
      form.setField('lastName', response.data.lastName);
      form.setField('dni', response.data.dni);
      form.setField('email', response.data.email);
      form.setField('phone', response.data.phone);
      form.setField('birthDate', response.data.birthDate?.split('T')[0]);
    } catch (err) {
      setError('Error al cargar el usuario');
      console.error(err);
    } finally {
      setLoading(false);
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
        <form onSubmit={form.handleSubmit} className="space-y-4">
          <FormField
            label="Nombre"
            name="firstName"
            value={form.formData.firstName}
            onChange={form.handleChange}
            error={form.errors.firstName}
            required
          />
          <FormField
            label="Apellidos"
            name="lastName"
            value={form.formData.lastName}
            onChange={form.handleChange}
            error={form.errors.lastName}
            required
          />
          <FormField
            label="DNI"
            name="dni"
            value={form.formData.dni}
            onChange={form.handleChange}
            error={form.errors.dni}
            required
          />
          <FormField
            label="Email"
            name="email"
            type="email"
            value={form.formData.email}
            onChange={form.handleChange}
            error={form.errors.email}
            required
          />
          <FormField
            label="Teléfono"
            name="phone"
            type="tel"
            value={form.formData.phone}
            onChange={form.handleChange}
            error={form.errors.phone}
          />
          <FormField
            label="Fecha Nacimiento"
            name="birthDate"
            type="date"
            value={form.formData.birthDate}
            onChange={form.handleChange}
            error={form.errors.birthDate}
            required
          />
          <div className="flex gap-2 pt-4">
            <Button type="submit" variant="success" disabled={form.isSubmitting}>
              {form.isSubmitting ? 'Guardando...' : 'Guardar'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsEditOpen(false);
                form.resetForm();
              }}
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

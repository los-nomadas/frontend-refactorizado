import { useEffect, useState } from 'react';
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

  const fieldClass =
    'rounded-md border-gray-300 bg-white px-4 py-3 shadow-sm transition-colors focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100';

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

  useEffect(() => {
    loadUser();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-10rem)] bg-primary-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <Loading />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-10rem)] bg-primary-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <p className="text-gray-600">Usuario no encontrado</p>
          <Button onClick={() => navigate('/users')} className="mt-4 rounded-md">
            Volver a Usuarios
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-10rem)] bg-primary-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <Button onClick={() => navigate('/users')} variant="secondary" className="rounded-md">
            ← Volver a Usuarios
          </Button>
        </div>

        {error && (
          <div className="mb-6">
            <Alert type="error" message={error} onClose={() => setError(null)} />
          </div>
        )}

        <div className="mb-6 rounded-xl border border-primary-100 bg-white px-6 py-5 shadow-sm">
          <p className="text-sm font-semibold text-primary-700">Detalle de usuario</p>
          <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-950">
                {user.firstName} {user.lastName}
              </h1>
              <p className="mt-2 text-sm text-gray-600">{user.email}</p>
            </div>
            <Button onClick={() => setIsEditOpen(true)} variant="primary" className="self-start rounded-md sm:self-auto">
              Editar Usuario
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-bold text-gray-950">Información Personal</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase text-gray-500">DNI</p>
              <p className="mt-1 text-base font-semibold text-gray-950">{user.dni}</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase text-gray-500">Email</p>
              <p className="mt-1 text-base font-semibold text-gray-950">{user.email}</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase text-gray-500">Teléfono</p>
              <p className="mt-1 text-base font-semibold text-gray-950">{user.phone}</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase text-gray-500">Fecha Nacimiento</p>
              <p className="mt-1 text-base font-semibold text-gray-950">
                {new Date(user.birthDate).toLocaleDateString()}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase text-gray-500">ID</p>
              <p className="mt-1 text-base font-semibold text-gray-950">{user.id}</p>
            </div>
          </div>
        </div>
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
            className={fieldClass}
            required
          />
          <FormField
            label="Apellidos"
            name="lastName"
            value={form.formData.lastName}
            onChange={form.handleChange}
            error={form.errors.lastName}
            className={fieldClass}
            required
          />
          <FormField
            label="DNI"
            name="dni"
            value={form.formData.dni}
            onChange={form.handleChange}
            error={form.errors.dni}
            className={fieldClass}
            required
          />
          <FormField
            label="Email"
            name="email"
            type="email"
            value={form.formData.email}
            onChange={form.handleChange}
            error={form.errors.email}
            className={fieldClass}
            required
          />
          <FormField
            label="Teléfono"
            name="phone"
            type="tel"
            value={form.formData.phone}
            onChange={form.handleChange}
            error={form.errors.phone}
            className={fieldClass}
          />
          <FormField
            label="Fecha Nacimiento"
            name="birthDate"
            type="date"
            value={form.formData.birthDate}
            onChange={form.handleChange}
            error={form.errors.birthDate}
            className={fieldClass}
            required
          />
          <div className="flex flex-col gap-2 pt-4 sm:flex-row">
            <Button type="submit" variant="primary" disabled={form.isSubmitting} className="rounded-md">
              {form.isSubmitting ? 'Guardando...' : 'Guardar'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsEditOpen(false);
                form.resetForm();
              }}
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

export default UserDetailPage;

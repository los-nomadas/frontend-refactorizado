import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../api/services';
import { Alert } from '../../components/common/Feedback';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const response = await authService.login(credentials);
      const token = response.data?.token;
      if (!token) {
        throw new Error('Login response missing token');
      }
      login(response.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Credenciales inválidas');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-14rem)] bg-primary-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[32rem] max-w-md items-center">
        <div className="w-full">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-950">Acceso operador</h1>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              Inicia sesión para gestionar usuarios, viajes, reservas y el dashboard.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg sm:p-8">
            {error && (
              <div className="mb-5">
                <Alert type="error" message={error} onClose={() => setError(null)} />
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-800" htmlFor="username">
                  Usuario
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={credentials.username}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  autoComplete="username"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-800" htmlFor="password">
                  Contraseña
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={credentials.password}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  autoComplete="current-password"
                  required
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                disabled={submitting}
                className="w-full rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2"
              >
                {submitting ? 'Entrando…' : 'Entrar'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

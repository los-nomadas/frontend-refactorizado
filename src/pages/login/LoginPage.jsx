import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../api/services';
import { Alert } from '../../components/common/Feedback';
import Button from '../../components/common/Button';

const LoginPage = () => {
  const navigate = useNavigate();
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
      localStorage.setItem('authToken', token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Credenciales inválidas');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Acceso operador</h1>
      <p className="text-sm text-gray-600 text-center mb-6">
        Inicia sesión para gestionar usuarios, viajes, reservas y el dashboard.
      </p>

      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-4">
        <div>
          <label className="block font-semibold mb-1" htmlFor="username">
            Usuario
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={credentials.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            autoComplete="username"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1" htmlFor="password">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={credentials.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            autoComplete="current-password"
            required
          />
        </div>
        <Button type="submit" variant="primary" disabled={submitting} className="w-full">
          {submitting ? 'Entrando…' : 'Entrar'}
        </Button>
        <p className="text-xs text-gray-500 text-center pt-2">
          Demo: admin / admin12345
        </p>
      </form>
    </div>
  );
};

export default LoginPage;

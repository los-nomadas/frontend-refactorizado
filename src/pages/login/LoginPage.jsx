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
<<<<<<< HEAD
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
=======
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #050816, #0f172a)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          backgroundColor: '#111827',
          padding: '40px',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '420px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          boxShadow: '0 0 40px rgba(0,0,0,0.5)',
          border: '1px solid #1f2937',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            marginBottom: '10px',
          }}
        >
          <h1
            style={{
              color: 'white',
              marginBottom: '10px',
              fontSize: '42px',
              fontWeight: 'bold',
            }}
          >
            Nomadas
          </h1>

          <p
            style={{
              color: '#9ca3af',
              fontSize: '16px',
            }}
          >
            Accede a tu cuenta para continuar
          </p>
        </div>

        <input
          type="text"
          autoComplete="username"
          placeholder="Usuario"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          disabled={loading}
          style={{
            padding: '16px',
            borderRadius: '10px',
            border: '1px solid #374151',
            backgroundColor: '#1f2937',
            color: 'white',
            fontSize: '16px',
            outline: 'none',
          }}
        />

        <input
          type="password"
          autoComplete="current-password"
          placeholder="Contraseña"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={loading}
          style={{
            padding: '16px',
            borderRadius: '10px',
            border: '1px solid #374151',
            backgroundColor: '#1f2937',
            color: 'white',
            fontSize: '16px',
            outline: 'none',
          }}
        />

        {error && (
          <div
            role="alert"
            style={{
              color: '#ff6b6b',
              textAlign: 'center',
              backgroundColor: 'rgba(255,0,0,0.1)',
              padding: '12px',
              borderRadius: '10px',
              border: '1px solid rgba(255,0,0,0.2)',
            }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '16px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: loading ? '#1d4ed8' : '#2563eb',
            color: 'white',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            fontSize: '16px',
          }}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
>>>>>>> 81d6cd9 (feat: complete frontend-backend integration with JWT, bookings and dashboard)

export default LoginPage;

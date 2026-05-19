import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { bookingService } from '../../api/services';
import MainLayout from '../../components/layout/MainLayout';

const boardLabel = (boardType) =>
  boardType === 'FULL_BOARD' ? 'Pensión completa' : 'Media pensión';

const groupLabel = (groupType) => {
  if (groupType === 'IMSERSO') return 'IMSERSO';
  if (groupType === 'SCHOOL') return 'Escolar';
  return 'Individual';
};

const formatDate = (date) => {
  if (!date) return 'Sin fecha';
  return new Date(date).toLocaleDateString();
};

const resolveError = (requestError) => {
  if (!requestError.response) {
    return 'No se puede conectar con el servidor. Revisa que el backend esté arrancado.';
  }

  if (requestError.response.status === 401) {
    return 'Tu sesión ha caducado. Vuelve a iniciar sesión.';
  }

  if (requestError.response.status === 404) {
    return 'No hay un usuario cliente vinculado a esta cuenta.';
  }

  return requestError.response.data?.message || 'Error al cargar tus reservas.';
};

function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await bookingService.getMy();
      setBookings(response.data || []);
    } catch (requestError) {
      console.error(requestError);
      setError(resolveError(requestError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  return (
    <MainLayout>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          <h1
            style={{
              fontSize: '42px',
            }}
          >
            Mis reservas
          </h1>

          <Link
            to="/trips"
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '10px 16px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 'bold',
            }}
          >
            Reservar otro viaje
          </Link>
        </div>

        {error && (
          <div
            role="alert"
            style={{
              color: '#fecaca',
              backgroundColor: '#7f1d1d',
              padding: '12px 16px',
              borderRadius: '10px',
            }}
          >
            {error}
          </div>
        )}

        {loading ? (
          <p>Cargando reservas...</p>
        ) : bookings.length === 0 ? (
          <div
            style={{
              backgroundColor: '#111827',
              padding: '28px',
              borderRadius: '16px',
              color: '#d1d5db',
            }}
          >
            Todavía no tienes reservas.
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '20px',
            }}
          >
            {bookings.map((booking) => (
              <article
                key={booking.id}
                style={{
                  backgroundColor: '#111827',
                  borderRadius: '16px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '12px',
                    alignItems: 'start',
                  }}
                >
                  <div>
                    <h2
                      style={{
                        fontSize: '26px',
                        marginBottom: '6px',
                      }}
                    >
                      {booking.tripDestination}
                    </h2>
                    <p>Hotel: {booking.hotelName || 'No disponible'}</p>
                  </div>

                  <span
                    style={{
                      backgroundColor: '#065f46',
                      color: '#d1fae5',
                      padding: '6px 10px',
                      borderRadius: '999px',
                      fontSize: '14px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Confirmada
                  </span>
                </div>

                <p>
                  Fechas: {formatDate(booking.tripDepartureDate)} -{' '}
                  {formatDate(booking.tripReturnDate)}
                </p>
                <p>Régimen: {boardLabel(booking.boardType)}</p>
                <p>Grupo: {groupLabel(booking.groupType)}</p>
                <p>Plazas reservadas: {booking.companions?.length ?? 0}</p>
                <p>Estado del viaje: {booking.tripStatus || 'Confirmado'}</p>

                <strong
                  style={{
                    fontSize: '24px',
                    marginTop: '8px',
                  }}
                >
                  Total: €{booking.totalPrice}
                </strong>
              </article>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default MyBookingsPage;

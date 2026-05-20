import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { bookingService, tripService } from '../../api/services';
import MainLayout from '../../components/layout/MainLayout';
import { useAuth } from '../../context/AuthContext';

const initialCompanion = {
  firstName: '',
  lastName: '',
  birthDate: '',
};

const resolveBookingError = (requestError) => {
  if (!requestError.response) {
    return 'No se puede conectar con el servidor. Revisa que el backend esté arrancado.';
  }

  if (requestError.response.status === 401) {
    return 'Tu sesión ha caducado. Vuelve a iniciar sesión.';
  }

  if (requestError.response.status === 409) {
    return requestError.response.data?.message || 'No se puede completar la reserva.';
  }

  if (requestError.response.status === 404) {
    return requestError.response.data?.message || 'No se encontró el recurso necesario para reservar.';
  }

  return requestError.response.data?.message || 'Error al crear la reserva.';
};

function TripDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [boardType, setBoardType] = useState('FULL_BOARD');
  const [groupType, setGroupType] = useState('NONE');
  const [companions, setCompanions] = useState([initialCompanion]);

  const loadTrip = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await tripService.getById(id);
      setTrip(response.data);
      setBoardType(response.data?.boardType || 'FULL_BOARD');
    } catch (requestError) {
      console.error(requestError);
      setError('Error al cargar el viaje');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrip();
  }, [id]);

  const updateCompanion = (index, field, value) => {
    setCompanions((currentCompanions) =>
      currentCompanions.map((companion, companionIndex) =>
        companionIndex === index
          ? {
              ...companion,
              [field]: value,
            }
          : companion
      )
    );
  };

  const addCompanion = () => {
    setCompanions((currentCompanions) => [
      ...currentCompanions,
      { ...initialCompanion },
    ]);
  };

  const removeCompanion = (index) => {
    setCompanions((currentCompanions) =>
      currentCompanions.filter((_, companionIndex) => companionIndex !== index)
    );
  };

  const validateBookingForm = () => {
    if (!isAuthenticated) {
      return 'Debes iniciar sesión para reservar.';
    }

    if (!user?.userId) {
      return 'Tu cuenta no tiene un usuario cliente vinculado. Crea o vincula un usuario con el mismo email.';
    }

    if (!trip?.availableSeats || trip.availableSeats < companions.length) {
      return 'No hay plazas suficientes para esta reserva.';
    }

    const hasInvalidCompanion = companions.some(
      (companion) =>
        !companion.firstName.trim() ||
        !companion.lastName.trim() ||
        !companion.birthDate
    );

    if (hasInvalidCompanion) {
      return 'Completa los datos de todos los viajeros.';
    }

    return '';
  };

  const handleBooking = async (event) => {
    event.preventDefault();
    const validationError = validateBookingForm();

    if (validationError) {
      setBookingError(validationError);
      setBookingSuccess('');
      return;
    }

    try {
      setBookingLoading(true);
      setBookingError('');
      setBookingSuccess('');

      const payload = {
        userId: user.userId,
        tripId: Number(id),
        boardType,
        groupType,
        companions: companions.map((companion) => ({
          firstName: companion.firstName.trim(),
          lastName: companion.lastName.trim(),
          birthDate: companion.birthDate,
        })),
      };

      const response = await bookingService.create(payload);
      setBookingSuccess(`Reserva #${response.data.id} creada correctamente.`);
      setCompanions([{ ...initialCompanion }]);
      await loadTrip();
    } catch (requestError) {
      console.error(requestError);
      setBookingError(resolveBookingError(requestError));
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <p>Cargando viaje...</p>
      </MainLayout>
    );
  }

  if (error || !trip) {
    return (
      <MainLayout>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <p>{error || 'Viaje no encontrado'}</p>
          <Link to="/trips">Volver a viajes</Link>
        </div>
      </MainLayout>
    );
  }

  const hasSeats = Number(trip.availableSeats) > 0;

  return (
    <MainLayout>
      <article
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px',
          alignItems: 'start',
        }}
      >
        {trip.imageUrl ? (
          <img
            src={trip.imageUrl}
            alt={trip.destination}
            style={{
              width: '100%',
              minHeight: '320px',
              objectFit: 'cover',
              borderRadius: '18px',
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              minHeight: '320px',
              borderRadius: '18px',
              background: 'linear-gradient(135deg, #1e3a5f, #2d6a9f)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ textAlign: 'center', color: 'white' }}>
              <p style={{ fontWeight: '600' }}>Nomadas</p>
              <p style={{ fontSize: '14px', opacity: 0.7 }}>Imagen no disponible</p>
            </div>
          </div>
        )}

        <div
          style={{
            backgroundColor: '#111827',
            padding: '32px',
            borderRadius: '18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
          }}
        >
          <Link
            to="/trips"
            style={{
              color: '#93c5fd',
              textDecoration: 'none',
              fontWeight: 'bold',
            }}
          >
            Volver a viajes
          </Link>

          {trip.isOffer && (
            <span
              style={{
                display: 'inline-block',
                fontSize: '13px',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #f97316, #ef4444)',
                color: 'white',
                padding: '5px 14px',
                borderRadius: '20px',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                boxShadow: '0 2px 8px rgba(249,115,22,0.4)',
              }}
            >
              Oferta especial
            </span>
          )}

          <h1
            style={{
              fontSize: '44px',
            }}
          >
            {trip.destination}
          </h1>

          {trip.description && <p>{trip.description}</p>}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '16px',
            }}
          >
            <p>Hotel: {trip.hotelName}</p>
            <p>Bus: {trip.busPlateNumber}</p>
            <p>Régimen: {trip.boardType}</p>
            <p>Estado: {trip.status}</p>
            <p>
              Salida:{' '}
              {trip.departureDate
                ? new Date(trip.departureDate).toLocaleDateString()
                : 'Sin fecha'}
            </p>
            <p>
              Regreso:{' '}
              {trip.returnDate
                ? new Date(trip.returnDate).toLocaleDateString()
                : 'Sin fecha'}
            </p>
            <p>
              Plazas: {trip.availableSeats}/{trip.totalSeats}
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '16px',
              flexWrap: 'wrap',
              alignItems: 'center',
              marginTop: '12px',
            }}
          >
            <strong
              style={{
                fontSize: '30px',
              }}
            >
              Adulto: €{trip.priceAdult}
            </strong>
            <span>Niño: €{trip.priceChild}</span>
            <span>Senior: €{trip.priceSenior}</span>
          </div>

          <form
            onSubmit={handleBooking}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              borderTop: '1px solid #374151',
              paddingTop: '24px',
              marginTop: '8px',
            }}
          >
            <h2
              style={{
                fontSize: '28px',
              }}
            >
              Reservar viaje
            </h2>

            {!isAuthenticated && (
              <button
                type="button"
                onClick={() => navigate('/login', { state: { from: { pathname: `/trips/${id}` } } })}
                style={{
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                Iniciar sesión para reservar
              </button>
            )}

            {isAuthenticated && (
              <>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '12px',
                  }}
                >
                  <label>
                    Régimen
                    <select
                      value={boardType}
                      onChange={(event) => setBoardType(event.target.value)}
                      disabled={bookingLoading || !hasSeats}
                      style={{
                        width: '100%',
                        marginTop: '6px',
                        padding: '10px',
                        borderRadius: '8px',
                        backgroundColor: '#1f2937',
                        color: 'white',
                        border: '1px solid #374151',
                      }}
                    >
                      <option value="HALF_BOARD">Media pensión</option>
                      <option value="FULL_BOARD">Pensión completa</option>
                    </select>
                  </label>

                  <label>
                    Grupo
                    <select
                      value={groupType}
                      onChange={(event) => setGroupType(event.target.value)}
                      disabled={bookingLoading || !hasSeats}
                      style={{
                        width: '100%',
                        marginTop: '6px',
                        padding: '10px',
                        borderRadius: '8px',
                        backgroundColor: '#1f2937',
                        color: 'white',
                        border: '1px solid #374151',
                      }}
                    >
                      <option value="NONE">Individual</option>
                      <option value="IMSERSO">IMSERSO</option>
                      <option value="SCHOOL">Escolar</option>
                    </select>
                  </label>
                </div>

                {companions.map((companion, index) => (
                  <div
                    key={`companion-${index}`}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                      gap: '10px',
                      alignItems: 'end',
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Nombre"
                      value={companion.firstName}
                      onChange={(event) =>
                        updateCompanion(index, 'firstName', event.target.value)
                      }
                      disabled={bookingLoading || !hasSeats}
                      style={{
                        padding: '10px',
                        borderRadius: '8px',
                        backgroundColor: '#1f2937',
                        color: 'white',
                        border: '1px solid #374151',
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Apellidos"
                      value={companion.lastName}
                      onChange={(event) =>
                        updateCompanion(index, 'lastName', event.target.value)
                      }
                      disabled={bookingLoading || !hasSeats}
                      style={{
                        padding: '10px',
                        borderRadius: '8px',
                        backgroundColor: '#1f2937',
                        color: 'white',
                        border: '1px solid #374151',
                      }}
                    />
                    <input
                      type="date"
                      value={companion.birthDate}
                      onChange={(event) =>
                        updateCompanion(index, 'birthDate', event.target.value)
                      }
                      disabled={bookingLoading || !hasSeats}
                      style={{
                        padding: '10px',
                        borderRadius: '8px',
                        backgroundColor: '#1f2937',
                        color: 'white',
                        border: '1px solid #374151',
                      }}
                    />
                    {companions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCompanion(index)}
                        disabled={bookingLoading}
                        style={{
                          backgroundColor: '#7f1d1d',
                          color: 'white',
                          border: 'none',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                        }}
                      >
                        Quitar
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addCompanion}
                  disabled={bookingLoading || companions.length >= trip.availableSeats}
                  style={{
                    backgroundColor: '#374151',
                    color: 'white',
                    border: 'none',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    alignSelf: 'flex-start',
                  }}
                >
                  Añadir viajero
                </button>

                {bookingError && (
                  <div
                    role="alert"
                    style={{
                      color: '#fecaca',
                      backgroundColor: '#7f1d1d',
                      padding: '12px',
                      borderRadius: '8px',
                    }}
                  >
                    {bookingError}
                  </div>
                )}

                {bookingSuccess && (
                  <div
                    role="status"
                    style={{
                      color: '#d1fae5',
                      backgroundColor: '#065f46',
                      padding: '12px',
                      borderRadius: '8px',
                    }}
                  >
                    {bookingSuccess}{' '}
                    <Link
                      to="/my-bookings"
                      style={{
                        color: 'white',
                        fontWeight: 'bold',
                      }}
                    >
                      Ver mis reservas
                    </Link>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={bookingLoading || !hasSeats}
                  style={{
                    backgroundColor: hasSeats ? '#16a34a' : '#4b5563',
                    color: 'white',
                    border: 'none',
                    padding: '14px 18px',
                    borderRadius: '10px',
                    cursor: bookingLoading || !hasSeats ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold',
                    fontSize: '16px',
                  }}
                >
                  {bookingLoading
                    ? 'Reservando...'
                    : hasSeats
                      ? 'Reservar ahora'
                      : 'Sin plazas disponibles'}
                </button>
              </>
            )}
          </form>
        </div>
      </article>
    </MainLayout>
  );
}

export default TripDetailPage;

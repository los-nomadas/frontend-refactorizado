import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import MainLayout from '../../components/layout/MainLayout';
import { tripService } from '../../api/services';

function HomePage() {
  const [featuredTrips, setFeaturedTrips] = useState([]);
  const [error, setError] = useState(null);

  const loadFeaturedTrips = async () => {
    try {
      setError(null);
      const response = await tripService.getOffers();
      setFeaturedTrips((response.data || []).slice(0, 3));
    } catch (error) {
      setError('Error al cargar los viajes');
      console.error(error);
    }
  };

  const getBoardTypeLabel = (boardType) =>
    boardType === 'FULL_BOARD' ? 'Pensión completa' : 'Media pensión';

  useEffect(() => {
    loadFeaturedTrips();
  }, []);

  return (
    <MainLayout>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '60px',
        }}
      >
        <section
          style={{
            background: 'linear-gradient(135deg, #2563eb, #1e3a8a)',
            padding: '80px 40px',
            borderRadius: '24px',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              fontSize: '64px',
              marginBottom: '20px',
            }}
          >
            Descubre el mundo
          </h1>

          <p
            style={{
              fontSize: '22px',
              maxWidth: '700px',
              margin: '0 auto',
              color: '#dbeafe',
            }}
          >
            Reserva experiencias únicas, viajes inolvidables y destinos premium
            con Nomadas.
          </p>
        </section>

        <section>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '30px',
            }}
          >
            <h2
              style={{
                fontSize: '36px',
              }}
            >
              Viajes destacados
            </h2>

            <Link
              to="/trips"
              style={{
                color: '#60a5fa',
                textDecoration: 'none',
                fontWeight: 'bold',
              }}
            >
              Ver todos
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '25px',
            }}
          >
            {error && (
              <div
                role="alert"
                style={{
                  color: '#fca5a5',
                  fontSize: '20px',
                  marginTop: '20px',
                }}
              >
                {error}
              </div>
            )}

            {!error && featuredTrips.length === 0 && (
              <div
                style={{
                  color: '#9ca3af',
                  fontSize: '20px',
                  marginTop: '20px',
                }}
              >
                No hay viajes disponibles todavía.
              </div>
            )}

            {featuredTrips.map((trip) => (
              <div
                key={trip.id}
                style={{
                  backgroundColor: '#111827',
                  borderRadius: '18px',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={trip.imageUrl || 'https://picsum.photos/600/400'}
                  alt={trip.destination}
                  style={{
                    width: '100%',
                    height: '220px',
                    objectFit: 'cover',
                  }}
                />

                <div
                  style={{
                    padding: '20px',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '28px',
                      marginBottom: '10px',
                    }}
                  >
                    {trip.destination}
                  </h3>

                  <p>{trip.hotelName}</p>

                  <div
                    style={{
                      marginTop: '14px',
                      color: '#d1d5db',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                    }}
                  >
                    <p>Adulto €{trip.priceAdult}</p>
                    <p>Niño €{trip.priceChild}</p>
                    <p>Senior €{trip.priceSenior}</p>
                    <p>{getBoardTypeLabel(trip.boardType)}</p>
                  </div>

                  <div
                    style={{
                      marginTop: '20px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '28px',
                        fontWeight: 'bold',
                      }}
                    >
                      €{trip.priceAdult}
                    </span>

                    <Link
                      to={`/trips/${trip.id}`}
                      style={{
                        backgroundColor: '#2563eb',
                        color: 'white',
                        padding: '10px 18px',
                        borderRadius: '10px',
                        textDecoration: 'none',
                        fontWeight: 'bold',
                      }}
                    >
                      Ver viaje
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}

export default HomePage;

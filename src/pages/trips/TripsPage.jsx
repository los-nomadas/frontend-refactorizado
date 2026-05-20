import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import MainLayout from '../../components/layout/MainLayout';
import { tripService } from '../../api/services';

function TripsPage() {
  const [trips, setTrips] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const loadTrips = async () => {
    try {
      const response = await tripService.getAll();
      setTrips(response.data || []);
    } catch (requestError) {
      console.error(requestError);
      setError('Error al cargar los viajes');
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  const toggleFavorite = (tripId) => {
    setFavorites((currentFavorites) =>
      currentFavorites.includes(tripId)
        ? currentFavorites.filter((favoriteId) => favoriteId !== tripId)
        : [...currentFavorites, tripId]
    );
  };

  const filteredTrips = trips.filter((trip) =>
    trip.destination?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '30px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '20px',
            flexWrap: 'wrap',
          }}
        >
          <h1
            style={{
              fontSize: '42px',
            }}
          >
            Viajes
          </h1>

          <input
            type="search"
            placeholder="Buscar destino"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            style={{
              width: '100%',
              maxWidth: '360px',
              padding: '12px 14px',
              borderRadius: '10px',
              border: '1px solid #374151',
              backgroundColor: '#111827',
              color: 'white',
              fontSize: '16px',
            }}
          />
        </div>

        {error && (
          <div
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

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '25px',
          }}
        >
          {filteredTrips.length === 0 && (
            <div
              style={{
                color: '#9ca3af',
                fontSize: '20px',
              }}
            >
              No hay viajes disponibles.
            </div>
          )}

          {filteredTrips.map((trip) => (
            <Link
              to={`/trips/${trip.id}`}
              key={trip.id}
              style={{
                textDecoration: 'none',
                color: 'white',
              }}
            >
              <div
                style={{
                  backgroundColor: '#111827',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 0 20px rgba(0,0,0,0.4)',
                  transition: '0.2s',
                  transform: 'translateY(0)',
                  cursor: 'pointer',
                }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.transform = 'translateY(-8px)';
                  event.currentTarget.style.boxShadow =
                    '0 20px 40px rgba(0,0,0,0.5)';
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.transform = 'translateY(0)';
                  event.currentTarget.style.boxShadow =
                    '0 0 20px rgba(0,0,0,0.4)';
                }}
              >
                {trip.imageUrl ? (
                  <img
                    src={trip.imageUrl}
                    alt={trip.destination}
                    style={{
                      width: '100%',
                      height: '220px',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <div className="flex h-[220px] w-full items-center justify-center bg-gradient-to-br from-primary-100 to-gray-100 text-center">
                    <div>
                      <p className="text-sm font-semibold text-primary-700">Nomadas</p>
                      <p className="mt-1 text-xs text-gray-500">Imagen no disponible</p>
                    </div>
                  </div>
                )}

                <div
                  style={{
                    padding: '20px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '10px',
                    }}
                  >
                    {trip.isOffer ? (
                      <span
                        style={{
                          fontSize: '13px',
                          fontWeight: '700',
                          background: 'linear-gradient(135deg, #f97316, #ef4444)',
                          color: 'white',
                          padding: '5px 12px',
                          borderRadius: '20px',
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase',
                          boxShadow: '0 2px 8px rgba(249,115,22,0.4)',
                        }}
                      >
                        Oferta
                      </span>
                    ) : (
                      <span style={{ visibility: 'hidden', padding: '5px 12px' }}>_</span>
                    )}

                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        toggleFavorite(trip.id);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '24px',
                        cursor: 'pointer',
                      }}
                    >
                      {favorites.includes(trip.id) ? '♥' : '♡'}
                    </button>
                  </div>

                  <h2
                    style={{
                      marginBottom: '10px',
                    }}
                  >
                    {trip.destination}
                  </h2>

                  <p>Hotel: {trip.hotelName}</p>
                  <p>Bus: {trip.busPlateNumber}</p>
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
                        fontSize: '24px',
                        fontWeight: 'bold',
                      }}
                    >
                      €{trip.priceAdult}
                    </span>

                    <span className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white">
                      Ver viaje
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}

export default TripsPage;

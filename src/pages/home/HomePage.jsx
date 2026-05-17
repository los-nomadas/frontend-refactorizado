import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tripService } from '../../api/services';
import { Loading, EmptyState, Alert } from '../../components/common/Feedback';

const HomePage = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      setLoading(true);
      const response = await tripService.getOffers();
      setTrips(response.data || []);
    } catch (err) {
      setError('Error al cargar los viajes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const boardLabel = (boardType) =>
    boardType === 'FULL_BOARD' ? 'Pensión completa' : 'Media pensión';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Bienvenido a Nomadas
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Descubre nuestros viajes más emocionantes
          </p>
          <Link
            to="/trips"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold"
          >
            Ver Todos los Viajes
          </Link>
        </div>

        {error && (
          <Alert type="error" message={error} onClose={() => setError(null)} />
        )}

        {loading ? (
          <Loading />
        ) : trips.length === 0 ? (
          <EmptyState message="No hay viajes disponibles en este momento" />
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-6">Viajes en oferta</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.slice(0, 6).map((trip) => (
                <div
                  key={trip.id}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
                >
                  {trip.imageUrl && (
                    <img
                      src={trip.imageUrl}
                      alt={trip.destination}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{trip.destination}</h3>
                    <p className="text-gray-600 mb-4">{trip.description}</p>
                    <div className="mb-4 space-y-1 text-sm text-gray-600">
                      <p>
                        <span className="font-semibold">Salida:</span>{' '}
                        {new Date(trip.departureDate).toLocaleDateString()}
                      </p>
                      <p>
                        <span className="font-semibold">Regreso:</span>{' '}
                        {new Date(trip.returnDate).toLocaleDateString()}
                      </p>
                      <p>
                        <span className="font-semibold">Régimen:</span>{' '}
                        {boardLabel(trip.boardType)}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm">
                        Adulto €{trip.priceAdult}
                      </span>
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded text-sm">
                        Niño €{trip.priceChild}
                      </span>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm">
                        Senior €{trip.priceSenior}
                      </span>
                    </div>
                    <Link
                      to={`/trips/${trip.id}`}
                      className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold"
                    >
                      Ver detalles
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;

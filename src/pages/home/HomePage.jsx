import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import MainLayout from '../../components/layout/MainLayout';
import Card from '../../components/common/Card';
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
      <div className="flex flex-col gap-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-600 to-primary-900 rounded-2xl px-10 md:px-16 py-20 md:py-24 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Descubre el mundo
          </h1>
          <p className="text-lg md:text-2xl max-w-2xl mx-auto text-blue-100">
            Reserva experiencias únicas, viajes inolvidables y destinos premium
            con Nomadas.
          </p>
        </section>

        {/* Featured Trips Section */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Viajes destacados
            </h2>
            <Link
              to="/trips"
              className="text-primary-500 font-semibold hover:text-primary-600 transition-colors"
            >
              Ver todos →
            </Link>
          </div>

          {error && (
            <div
              role="alert"
              className="text-red-400 text-lg mt-5 p-4 bg-red-50 rounded-lg border border-red-200"
            >
              {error}
            </div>
          )}

          {!error && featuredTrips.length === 0 && (
            <div className="text-gray-400 text-lg mt-5 p-4">
              No hay viajes disponibles todavía.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTrips.map((trip) => (
              <Card
                key={trip.id}
                shadow="lg"
                padding="lg"
                className="flex flex-col overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Trip Image */}
                <img
                  src={trip.imageUrl || 'https://picsum.photos/600/400'}
                  alt={trip.destination}
                  className="w-full h-56 object-cover rounded-lg mb-4"
                />

                {/* Trip Details */}
                <div className="flex-grow">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    {trip.destination}
                  </h3>
                  <p className="text-gray-600 font-medium mb-4">{trip.hotelName}</p>

                  {/* Pricing Info */}
                  <div className="space-y-2 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-200">
                    <p>Adulto €{trip.priceAdult}</p>
                    <p>Niño €{trip.priceChild}</p>
                    <p>Senior €{trip.priceSenior}</p>
                    <p className="font-medium text-gray-700">{getBoardTypeLabel(trip.boardType)}</p>
                  </div>
                </div>

                {/* Price + Action */}
                <div className="flex justify-between items-center mt-4">
                  <span className="text-3xl font-bold text-primary-600">
                    €{trip.priceAdult}
                  </span>
                  <Link
                    to={`/trips/${trip.id}`}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
                  >
                    Ver viaje
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}

export default HomePage;

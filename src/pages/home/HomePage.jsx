import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import MainLayout from '../../components/layout/MainLayout';
import Card from '../../components/common/Card';
import { tripService } from '../../api/services';

function HomePage() {
  const [featuredTrips, setFeaturedTrips] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadFeaturedTrips = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tripService.getOffers();
      setFeaturedTrips((response.data || []).slice(0, 3));
    } catch (error) {
      setError('Error al cargar los viajes');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getBoardTypeLabel = (boardType) =>
    boardType === 'FULL_BOARD' ? 'Pensión completa' : 'Media pensión';

  const formatTripDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString();
  };

  useEffect(() => {
    loadFeaturedTrips();
  }, []);

  return (
    <MainLayout>
      <div className="-m-10 min-h-screen bg-primary-50 text-gray-900">
        <section className="bg-gradient-to-br from-primary-700 via-primary-800 to-primary-950 px-4 py-16 text-white sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="mb-4 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-blue-100 ring-1 ring-white/20">
                Agencia de viajes Nomadas
              </p>
              <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                Descubre el mundo con viajes pensados para disfrutar
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-blue-100 sm:text-lg">
                Reserva experiencias únicas, destinos seleccionados y escapadas organizadas con una gestión sencilla y clara.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/trips"
                  className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-base font-semibold text-blue-900 shadow-lg transition-colors hover:bg-blue-50"
                >
                  Ver viajes
                </Link>
                <a
                  href="#viajes-destacados"
                  className="inline-flex items-center justify-center rounded-md border border-white/40 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Ofertas destacadas
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 shadow-xl backdrop-blur">
              <div className="rounded-xl bg-white p-5 text-gray-900 shadow-lg">
                <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-4">
                  <div>
                    <p className="text-sm font-semibold text-primary-700">Viajes destacados</p>
                    <p className="text-xs text-gray-500">Ofertas reales conectadas al backend</p>
                  </div>
                  <span className="rounded-full bg-primary-50 px-3 py-1 text-sm font-semibold text-primary-700">
                    Top 3
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="h-3 w-10/12 rounded-full bg-primary-100" />
                  <div className="h-3 w-8/12 rounded-full bg-gray-100" />
                  <div className="h-3 w-9/12 rounded-full bg-gray-100" />
                </div>
                <div className="mt-6 grid grid-cols-3 gap-3">
                  <div className="rounded-lg bg-primary-50 p-3">
                    <p className="text-xs text-gray-500">Adulto</p>
                    <p className="mt-1 text-lg font-bold text-primary-700">€</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-xs text-gray-500">Niño</p>
                    <p className="mt-1 text-lg font-bold text-gray-800">€</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-xs text-gray-500">Senior</p>
                    <p className="mt-1 text-lg font-bold text-gray-800">€</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="viajes-destacados" className="px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col gap-4 rounded-xl border border-primary-100 bg-white px-6 py-5 shadow-sm sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-primary-700">Ofertas</p>
                <h2 className="mt-1 text-3xl font-bold text-gray-950 md:text-4xl">
                  Viajes destacados
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Selección actual de viajes disponibles desde el backend.
                </p>
              </div>
              <Link
                to="/trips"
                className="self-start text-sm font-semibold text-primary-700 transition-colors hover:text-primary-900 sm:self-auto"
              >
                Ver todos →
              </Link>
            </div>

            {error && (
              <div
                role="alert"
                className="mb-8 rounded-xl border border-danger-50 bg-white p-6 text-danger-700 shadow-sm"
              >
                {error}
              </div>
            )}

            {loading && !error && (
              <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-600 shadow-sm">
                Cargando viajes destacados...
              </div>
            )}

            {!loading && !error && featuredTrips.length === 0 && (
              <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                <p className="text-lg font-semibold text-gray-900">No hay viajes disponibles todavía.</p>
                <p className="mt-2 text-sm text-gray-600">
                  Cuando el backend devuelva ofertas, aparecerán en esta sección.
                </p>
              </div>
            )}

            {!loading && !error && featuredTrips.length > 0 && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {featuredTrips.map((trip) => {
                  const departureDate = formatTripDate(trip.departureDate);
                  const returnDate = formatTripDate(trip.returnDate);

                  return (
                    <Card
                      key={trip.id}
                      shadow="lg"
                      padding="lg"
                      className="flex h-full flex-col overflow-hidden rounded-xl transition-shadow hover:shadow-xl"
                    >
                      <div className="relative mb-5">
                        {trip.imageUrl ? (
                          <img
                            src={trip.imageUrl}
                            alt={trip.destination}
                            className="h-56 w-full rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-56 items-center justify-center rounded-lg bg-gradient-to-br from-primary-100 to-gray-100">
                            <div className="text-center">
                              <p className="text-sm font-semibold text-primary-700">Nomadas</p>
                              <p className="mt-1 text-xs text-gray-500">Imagen no disponible</p>
                            </div>
                          </div>
                        )}
                        {trip.isOffer && (
                          <span className="absolute left-3 top-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-lg">
                            Oferta
                          </span>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-950">
                            {trip.destination}
                          </h3>
                          {trip.hotelName && (
                            <p className="mt-2 text-sm font-medium text-gray-600">{trip.hotelName}</p>
                          )}

                          {(departureDate || returnDate) && (
                            <p className="mt-4 rounded-lg bg-primary-50 px-4 py-3 text-sm font-medium text-primary-800">
                              {departureDate || 'Fecha pendiente'} - {returnDate || 'Fecha pendiente'}
                            </p>
                          )}

                          <div className="mt-5 space-y-2 border-t border-gray-100 pt-5 text-sm text-gray-600">
                            <p>Adulto €{trip.priceAdult}</p>
                            <p>Niño €{trip.priceChild}</p>
                            <p>Senior €{trip.priceSenior}</p>
                            <p className="font-semibold text-gray-800">{getBoardTypeLabel(trip.boardType)}</p>
                          </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between gap-4 border-t border-gray-100 pt-5">
                          <div>
                            <p className="text-xs font-semibold uppercase text-gray-500">Desde</p>
                            <span className="text-3xl font-bold text-primary-700">
                              €{trip.priceAdult}
                            </span>
                          </div>
                          <Link
                            to={`/trips/${trip.id}`}
                            className="rounded-md bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-primary-700"
                          >
                            Ver viaje
                          </Link>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}

export default HomePage;

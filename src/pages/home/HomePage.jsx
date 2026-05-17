import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { tripService } from '../../api/services';
import { Alert, EmptyState, Loading } from '../../components/common/Feedback';

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
      const response = await tripService.getAll();
      setTrips(response.data || []);
    } catch (err) {
      setError('Error al cargar los viajes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-10">
        <section className="mb-10">
          <h1 className="mb-3 text-4xl font-bold text-slate-950">Agencia de Viajes</h1>
          <p className="mb-6 max-w-3xl text-lg text-slate-600">
            Gestiona ofertas, reservas, hoteles, autobuses y conductores desde un unico panel.
          </p>
          <Link
            to="/trips"
            className="inline-flex rounded bg-sky-700 px-5 py-3 font-semibold text-white hover:bg-sky-800"
          >
            Ver viajes
          </Link>
        </section>

        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

        {loading ? (
          <Loading />
        ) : trips.length === 0 ? (
          <EmptyState message="No hay viajes disponibles en este momento" />
        ) : (
          <section>
            <h2 className="mb-5 text-2xl font-bold text-slate-900">Viajes destacados</h2>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {trips.slice(0, 6).map((trip) => (
                <article key={trip.id} className="overflow-hidden rounded bg-white shadow">
                  {trip.imageUrl && (
                    <img src={trip.imageUrl} alt={trip.destination} className="h-48 w-full object-cover" />
                  )}
                  <div className="p-5">
                    <h3 className="mb-2 text-xl font-bold text-slate-950">{trip.destination}</h3>
                    <p className="mb-4 text-slate-600">{trip.description}</p>
                    <dl className="mb-4 space-y-1 text-sm text-slate-600">
                      <div><dt className="inline font-semibold">Salida:</dt> <dd className="inline">{new Date(trip.departureDate).toLocaleDateString()}</dd></div>
                      <div><dt className="inline font-semibold">Regreso:</dt> <dd className="inline">{new Date(trip.returnDate).toLocaleDateString()}</dd></div>
                      <div><dt className="inline font-semibold">Adulto:</dt> <dd className="inline">EUR {trip.priceAdult}</dd></div>
                    </dl>
                    <Link
                      to={`/trips/${trip.id}`}
                      className="block rounded bg-sky-700 py-2 text-center font-semibold text-white hover:bg-sky-800"
                    >
                      Ver detalles
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default HomePage;

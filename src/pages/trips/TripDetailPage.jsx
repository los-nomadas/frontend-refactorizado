import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tripService, bookingService } from '../../api/services';
import { Loading, Alert } from '../../components/common/Feedback';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

const TripDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingData, setBookingData] = useState({
    boardType: 'HALF_BOARD',
    groupType: 'NONE',
    companions: [],
  });

  useEffect(() => {
    loadTrip();
  }, [id]);

  const loadTrip = async () => {
    try {
      setLoading(true);
      const response = await tripService.getById(id);
      setTrip(response.data);
    } catch (err) {
      setError('Error al cargar el viaje');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      await bookingService.create({
        tripId: id,
        ...bookingData,
      });
      setIsBookingOpen(false);
      setError(null);
      alert('¡Reserva realizada con éxito! Revisa tu email.');
      navigate('/bookings');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al realizar la reserva');
      console.error(err);
    }
  };

  if (loading) return <Loading />;

  if (!trip) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-600">Viaje no encontrado</p>
        <Button onClick={() => navigate('/trips')} className="mt-4">
          Volver a Viajes
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button onClick={() => navigate('/trips')} variant="secondary" className="mb-6">
        ← Volver a Viajes
      </Button>

      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {trip.imageUrl && (
          <img
            src={trip.imageUrl}
            alt={trip.destination}
            className="w-full h-96 object-cover"
          />
        )}

        <div className="p-8">
          <h1 className="text-4xl font-bold mb-4">{trip.destination}</h1>
          <p className="text-lg text-gray-600 mb-8">{trip.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="border rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Detalles del Viaje</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  <span className="font-semibold">Salida:</span>{' '}
                  {new Date(trip.departureDate).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p>
                  <span className="font-semibold">Regreso:</span>{' '}
                  {new Date(trip.returnDate).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p>
                  <span className="font-semibold">Autobús:</span> {trip.busId ? 'Asignado' : 'Pendiente'}
                </p>
                <p>
                  <span className="font-semibold">Hotel:</span> {trip.hotelId ? 'Asignado' : 'Pendiente'}
                </p>
                <p>
                  <span className="font-semibold">Plazas Disponibles:</span>{' '}
                  <span
                    className={`font-bold ${
                      trip.availableSeats > 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {trip.availableSeats} / {trip.totalSeats}
                  </span>
                </p>
              </div>
            </div>

            <div className="border rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Tarifas</h2>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded">
                  <p className="text-sm text-gray-600">Media Pensión</p>
                  <p className="text-3xl font-bold text-blue-600">€{trip.priceAdult}</p>
                </div>
                <div className="bg-green-50 p-4 rounded">
                  <p className="text-sm text-gray-600">Pensión Completa</p>
                  <p className="text-3xl font-bold text-green-600">€{trip.priceAdult + 50}</p>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  *Tarifas por persona adulta. Se aplicarán tarifas diferentes para niños (menores de 18) y pensionistas (mayores de 65).
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            {trip.availableSeats > 0 ? (
              <Button
                onClick={() => setIsBookingOpen(true)}
                variant="success"
                className="text-lg px-8 py-3"
              >
                Reservar Ahora
              </Button>
            ) : (
              <div className="bg-red-100 text-red-800 px-6 py-3 rounded-lg font-semibold">
                Este viaje está completo
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        title="Realizar Reserva"
      >
        <form onSubmit={handleBooking} className="space-y-4">
          <div>
            <label className="block font-semibold mb-2">Tipo de Pensión</label>
            <select
              value={bookingData.boardType}
              onChange={(e) =>
                setBookingData({ ...bookingData, boardType: e.target.value })
              }
              className="w-full px-4 py-2 border rounded"
            >
              <option value="HALF_BOARD">Media Pensión</option>
              <option value="FULL_BOARD">Pensión Completa</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-2">Tipo de Grupo</label>
            <select
              value={bookingData.groupType}
              onChange={(e) =>
                setBookingData({ ...bookingData, groupType: e.target.value })
              }
              className="w-full px-4 py-2 border rounded"
            >
              <option value="NONE">Individual</option>
              <option value="IMSERSO">IMSERSO</option>
              <option value="SCHOOL">Grupo Escolar</option>
            </select>
          </div>

          <div className="bg-blue-50 p-4 rounded text-sm text-gray-700">
            <p className="font-semibold mb-2">Requisitos:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Menores deben ir acompañados de adultos</li>
              <li>Proporciona nombres y fechas de nacimiento de acompañantes</li>
              <li>Recibirás confirmación por email</li>
            </ul>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" variant="success">
              Confirmar Reserva
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsBookingOpen(false)}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TripDetailPage;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tripService, bookingService, userService } from '../../api/services';
import { Loading, Alert } from '../../components/common/Feedback';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

const emptyCompanion = () => ({ firstName: '', lastName: '', birthDate: '' });

const TripDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const tripId = Number(id);

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [bookingData, setBookingData] = useState({
    userId: '',
    boardType: 'HALF_BOARD',
    groupType: 'NONE',
    companions: [emptyCompanion()],
  });

  useEffect(() => {
    loadTrip();
  }, [id]);

  const loadTrip = async () => {
    try {
      setLoading(true);
      const response = await tripService.getById(tripId);
      setTrip(response.data);
    } catch (err) {
      setError('Error al cargar el viaje');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openBooking = async () => {
    try {
      const response = await userService.getAll();
      setUsers(response.data || []);
      setIsBookingOpen(true);
    } catch (err) {
      setError('No se pudo cargar el listado de clientes');
      console.error(err);
    }
  };

  const updateCompanion = (index, field, value) => {
    setBookingData((prev) => {
      const companions = prev.companions.map((c, i) =>
        i === index ? { ...c, [field]: value } : c
      );
      return { ...prev, companions };
    });
  };

  const addCompanion = () => {
    setBookingData((prev) => ({
      ...prev,
      companions: [...prev.companions, emptyCompanion()],
    }));
  };

  const removeCompanion = (index) => {
    setBookingData((prev) => ({
      ...prev,
      companions: prev.companions.filter((_, i) => i !== index),
    }));
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!bookingData.userId) {
      setError('Selecciona el cliente que realiza la reserva');
      return;
    }
    if (bookingData.companions.length === 0) {
      setError('Añade al menos un viajero');
      return;
    }
    try {
      await bookingService.create({
        userId: Number(bookingData.userId),
        tripId,
        boardType: bookingData.boardType,
        groupType: bookingData.groupType,
        companions: bookingData.companions,
      });
      setIsBookingOpen(false);
      setError(null);
      alert('¡Reserva realizada con éxito! El cliente recibirá un email.');
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
              <h2 className="text-2xl font-bold mb-4">Detalles del viaje</h2>
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
                  <span className="font-semibold">Hotel:</span> {trip.hotelName}
                </p>
                <p>
                  <span className="font-semibold">Autobús:</span> {trip.busPlateNumber}
                </p>
                <p>
                  <span className="font-semibold">Régimen:</span> {trip.boardType === 'FULL_BOARD' ? 'Pensión completa' : 'Media pensión'}
                </p>
                <p>
                  <span className="font-semibold">Plazas disponibles:</span>{' '}
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
              <h2 className="text-2xl font-bold mb-4">Tarifas por persona</h2>
              <div className="space-y-3">
                <div className="bg-blue-50 p-4 rounded">
                  <p className="text-sm text-gray-600">Adulto (18 - 64)</p>
                  <p className="text-3xl font-bold text-blue-600">€{trip.priceAdult}</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded">
                  <p className="text-sm text-gray-600">Niño (menor de 18)</p>
                  <p className="text-3xl font-bold text-yellow-700">€{trip.priceChild}</p>
                </div>
                <div className="bg-green-50 p-4 rounded">
                  <p className="text-sm text-gray-600">Pensionista (65+)</p>
                  <p className="text-3xl font-bold text-green-700">€{trip.priceSenior}</p>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Las reservas IMSERSO aplican 20% de descuento y las escolares 15%, calculados en el backend.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            {trip.availableSeats > 0 ? (
              <Button
                onClick={openBooking}
                variant="success"
                className="text-lg px-8 py-3"
              >
                Reservar ahora
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
        title="Realizar reserva"
      >
        <form onSubmit={handleBooking} className="space-y-4">
          <div>
            <label className="block font-semibold mb-2">Cliente</label>
            <select
              value={bookingData.userId}
              onChange={(e) => setBookingData({ ...bookingData, userId: e.target.value })}
              className="w-full px-4 py-2 border rounded"
              required
            >
              <option value="">Selecciona un cliente</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName} ({user.email})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-2">Régimen</label>
              <select
                value={bookingData.boardType}
                onChange={(e) =>
                  setBookingData({ ...bookingData, boardType: e.target.value })
                }
                className="w-full px-4 py-2 border rounded"
              >
                <option value="HALF_BOARD">Media pensión</option>
                <option value="FULL_BOARD">Pensión completa</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-2">Tipo de grupo</label>
              <select
                value={bookingData.groupType}
                onChange={(e) =>
                  setBookingData({ ...bookingData, groupType: e.target.value })
                }
                className="w-full px-4 py-2 border rounded"
              >
                <option value="NONE">Individual</option>
                <option value="IMSERSO">IMSERSO (-20%)</option>
                <option value="SCHOOL">Escolar (-15%)</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block font-semibold">Viajeros</label>
              <Button type="button" variant="secondary" onClick={addCompanion}>
                + Añadir viajero
              </Button>
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {bookingData.companions.map((companion, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-end border rounded p-2">
                  <input
                    className="col-span-4 px-2 py-1 border rounded"
                    placeholder="Nombre"
                    value={companion.firstName}
                    onChange={(e) => updateCompanion(index, 'firstName', e.target.value)}
                    required
                  />
                  <input
                    className="col-span-4 px-2 py-1 border rounded"
                    placeholder="Apellidos"
                    value={companion.lastName}
                    onChange={(e) => updateCompanion(index, 'lastName', e.target.value)}
                    required
                  />
                  <input
                    type="date"
                    className="col-span-3 px-2 py-1 border rounded"
                    value={companion.birthDate}
                    onChange={(e) => updateCompanion(index, 'birthDate', e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="col-span-1 text-red-600 font-bold"
                    onClick={() => removeCompanion(index)}
                    disabled={bookingData.companions.length === 1}
                    title="Eliminar viajero"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Un menor de 18 años no puede viajar sin al menos un adulto.
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" variant="success">
              Confirmar reserva
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

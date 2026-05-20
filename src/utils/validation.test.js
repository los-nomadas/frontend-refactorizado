import { describe, expect, it } from 'vitest';
import {
  validateBookingForm,
  validateBusForm,
  validateDNI,
  validateDriverForm,
  validateEmail,
  validateHotelForm,
  validatePhone,
  validateTripForm,
  validateUserForm,
} from './validation';

describe('field validators', () => {
  it('accepts standard emails and rejects malformed ones', () => {
    expect(validateEmail('carla@nomadas.com')).toBe(true);
    expect(validateEmail('not-an-email')).toBe(false);
    expect(validateEmail('missing@dot')).toBe(false);
  });

  it('accepts phones with digits, spaces, dashes, plus and parens above 6 chars', () => {
    expect(validatePhone('611222333')).toBe(true);
    expect(validatePhone('+34 611-222-333')).toBe(true);
    expect(validatePhone('123')).toBe(false);
  });

  it('accepts dni with 8-10 chars only', () => {
    expect(validateDNI('12345678A')).toBe(true);
    expect(validateDNI('1234567')).toBe(false);
    expect(validateDNI('123456789012')).toBe(false);
  });
});

describe('validateUserForm', () => {
  const validUser = {
    firstName: 'Carla',
    lastName: 'Vega',
    dni: '12345678A',
    email: 'carla@nomadas.com',
    phone: '611222333',
    birthDate: '1985-03-10',
  };

  it('returns no errors for a valid user', () => {
    expect(validateUserForm(validUser)).toEqual({});
  });

  it('flags missing or invalid fields', () => {
    const errors = validateUserForm({ ...validUser, firstName: '', email: 'bad', dni: '1' });
    expect(errors).toHaveProperty('firstName');
    expect(errors).toHaveProperty('email');
    expect(errors).toHaveProperty('dni');
  });
});

describe('validateHotelForm', () => {
  const validHotel = {
    name: 'Hotel Costa',
    description: 'Hotel frente al mar',
    location: 'Málaga',
    totalRooms: 100,
    availableRooms: 40,
    totalPlaces: 200,
    availablePlaces: 80,
    halfBoardPrice: 50,
    fullBoardPrice: 80,
    imageUrl: 'https://example.com/hotel.jpg',
  };

  it('returns no errors for a valid hotel', () => {
    expect(validateHotelForm(validHotel)).toEqual({});
  });

  it('requires backend contract fields', () => {
    const errors = validateHotelForm({
      name: '',
      description: '',
      location: '',
      totalRooms: 0,
      availableRooms: '',
      totalPlaces: 0,
      availablePlaces: '',
      halfBoardPrice: '',
      fullBoardPrice: '',
      imageUrl: '',
    });
    expect(Object.keys(errors).sort()).toEqual([
      'availablePlaces',
      'availableRooms',
      'description',
      'fullBoardPrice',
      'halfBoardPrice',
      'imageUrl',
      'location',
      'name',
      'totalPlaces',
      'totalRooms',
    ]);
  });

  it('rejects availableRooms greater than totalRooms', () => {
    const errors = validateHotelForm({ ...validHotel, totalRooms: 10, availableRooms: 11 });
    expect(errors).toHaveProperty('availableRooms');
  });

  it('rejects availablePlaces greater than totalPlaces', () => {
    const errors = validateHotelForm({ ...validHotel, totalPlaces: 10, availablePlaces: 11 });
    expect(errors).toHaveProperty('availablePlaces');
  });

  it('requires imageUrl because the backend DTO is NotBlank', () => {
    const errors = validateHotelForm({ ...validHotel, imageUrl: '' });
    expect(errors).toHaveProperty('imageUrl');
  });
});

describe('validateBusForm', () => {
  const validBus = {
    plateNumber: '1234ABC',
    totalSeats: 50,
    availableSeats: 40,
    driverId: 1,
  };

  it('returns no errors for a valid bus', () => {
    expect(validateBusForm(validBus)).toEqual({});
  });

  it('requires positive totalSeats', () => {
    const errors = validateBusForm({ ...validBus, totalSeats: 0 });
    expect(errors).toHaveProperty('totalSeats');
  });

  it('rejects negative availableSeats', () => {
    const errors = validateBusForm({ ...validBus, availableSeats: -1 });
    expect(errors).toHaveProperty('availableSeats');
  });

  it('rejects availableSeats greater than totalSeats', () => {
    const errors = validateBusForm({ ...validBus, totalSeats: 30, availableSeats: 31 });
    expect(errors).toHaveProperty('availableSeats');
  });
});

describe('validateDriverForm', () => {
  const validDriver = {
    firstName: 'Marta',
    lastName: 'Lopez',
    dni: '12345678A',
    licenseNumber: 'LIC-123',
    phone: '611222333',
    email: 'marta@nomadas.com',
    available: true,
  };

  it('returns no errors for a valid driver', () => {
    expect(validateDriverForm(validDriver)).toEqual({});
  });

  it('requires email', () => {
    const errors = validateDriverForm({ ...validDriver, email: '' });
    expect(errors).toHaveProperty('email');
  });

  it('rejects invalid email', () => {
    const errors = validateDriverForm({ ...validDriver, email: 'bad-email' });
    expect(errors).toHaveProperty('email');
  });
});

describe('validateTripForm', () => {
  it('flags returnDate when it equals or precedes departureDate', () => {
    const errors = validateTripForm({
      destination: 'Lisboa',
      departureDate: '2026-06-10',
      returnDate: '2026-06-05',
      price: 100,
    });
    expect(errors.returnDate).toBe('La fecha de regreso debe ser posterior a la de salida');
  });

  it('passes when dates are coherent and destination plus price provided', () => {
    expect(
      validateTripForm({
        destination: 'Lisboa',
        departureDate: '2026-06-10',
        returnDate: '2026-06-15',
        price: 100,
      })
    ).toEqual({});
  });
});

describe('validateBookingForm', () => {
  it('requires userId, tripId and boardType', () => {
    expect(validateBookingForm({})).toEqual({
      userId: 'Selecciona un usuario',
      tripId: 'Selecciona un viaje',
      boardType: 'Selecciona el tipo de pensión',
    });
  });
});

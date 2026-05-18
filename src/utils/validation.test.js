import { describe, expect, it } from 'vitest';
import {
  validateBookingForm,
  validateDNI,
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
  it('requires positive totalRooms, totalPlaces and prices', () => {
    const errors = validateHotelForm({
      name: '',
      location: '',
      totalRooms: 0,
      totalPlaces: 0,
      halfBoardPrice: 0,
      fullBoardPrice: 0,
    });
    expect(Object.keys(errors).sort()).toEqual([
      'fullBoardPrice',
      'halfBoardPrice',
      'location',
      'name',
      'totalPlaces',
      'totalRooms',
    ]);
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

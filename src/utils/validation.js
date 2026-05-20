// Validación de campos
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[\d\s()+-]{6,}$/;
  return phoneRegex.test(phone);
};

export const validateDNI = (dni) => {
  // Simple validation: DNI should be 8-10 characters
  return dni && dni.length >= 8 && dni.length <= 10;
};

export const validateDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

export const validateAge = (birthDate, minAge = 0) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age >= minAge;
};

export const validateRequiredField = (value) => {
  return value && value.toString().trim().length > 0;
};

export const validateMinLength = (value, minLength) => {
  return value && value.toString().length >= minLength;
};

export const validateMaxLength = (value, maxLength) => {
  return value && value.toString().length <= maxLength;
};

// Validación de formularios completos
export const validateUserForm = (formData) => {
  const errors = {};

  if (!validateRequiredField(formData.firstName)) {
    errors.firstName = 'El nombre es requerido';
  }

  if (!validateRequiredField(formData.lastName)) {
    errors.lastName = 'Los apellidos son requeridos';
  }

  if (!validateDNI(formData.dni)) {
    errors.dni = 'DNI inválido';
  }

  if (!validateEmail(formData.email)) {
    errors.email = 'Email inválido';
  }

  if (formData.phone && !validatePhone(formData.phone)) {
    errors.phone = 'Teléfono inválido';
  }

  if (formData.birthDate && !validateDate(formData.birthDate)) {
    errors.birthDate = 'Fecha inválida';
  }

  return errors;
};

export const validateHotelForm = (formData) => {
  const errors = {};

  if (!validateRequiredField(formData.name)) {
    errors.name = 'El nombre del hotel es requerido';
  }

  if (!validateRequiredField(formData.location)) {
    errors.location = 'La ubicación es requerida';
  }

  if (!formData.totalRooms || formData.totalRooms <= 0) {
    errors.totalRooms = 'Las habitaciones deben ser mayor a 0';
  }

  if (!formData.totalPlaces || formData.totalPlaces <= 0) {
    errors.totalPlaces = 'Las plazas deben ser mayor a 0';
  }

  if (!formData.halfBoardPrice || formData.halfBoardPrice <= 0) {
    errors.halfBoardPrice = 'El precio debe ser mayor a 0';
  }

  if (!formData.fullBoardPrice || formData.fullBoardPrice <= 0) {
    errors.fullBoardPrice = 'El precio debe ser mayor a 0';
  }

  return errors;
};

export const validateBusForm = (formData) => {
  const errors = {};
  const totalSeats = Number(formData.totalSeats);
  const availableSeats = Number(formData.availableSeats);

  if (!validateRequiredField(formData.plateNumber)) {
    errors.plateNumber = 'La matrícula es requerida';
  }

  if (!Number.isFinite(totalSeats) || totalSeats <= 0) {
    errors.totalSeats = 'Los asientos totales deben ser mayor a 0';
  }

  if (
    formData.availableSeats === '' ||
    formData.availableSeats === undefined ||
    !Number.isFinite(availableSeats) ||
    availableSeats < 0
  ) {
    errors.availableSeats = 'Los asientos disponibles no pueden ser negativos';
  }

  if (
    !errors.totalSeats &&
    !errors.availableSeats &&
    availableSeats > totalSeats
  ) {
    errors.availableSeats = 'Los asientos disponibles no pueden superar los totales';
  }

  return errors;
};

export const validateDriverForm = (formData) => {
  const errors = {};

  if (!validateRequiredField(formData.firstName)) {
    errors.firstName = 'El nombre es requerido';
  }

  if (!validateRequiredField(formData.lastName)) {
    errors.lastName = 'Los apellidos son requeridos';
  }

  if (!validateDNI(formData.dni)) {
    errors.dni = 'DNI inválido';
  }

  if (!validateRequiredField(formData.licenseNumber)) {
    errors.licenseNumber = 'El número de licencia es requerido';
  }

  if (!validateEmail(formData.email)) {
    errors.email = 'Email inválido';
  }

  if (formData.phone && !validatePhone(formData.phone)) {
    errors.phone = 'Teléfono inválido';
  }

  return errors;
};

export const validateTripForm = (formData) => {
  const errors = {};

  if (!validateRequiredField(formData.destination)) {
    errors.destination = 'El destino es requerido';
  }

  if (!validateDate(formData.departureDate)) {
    errors.departureDate = 'Fecha de salida inválida';
  }

  if (!validateDate(formData.returnDate)) {
    errors.returnDate = 'Fecha de regreso inválida';
  }

  if (formData.departureDate && formData.returnDate) {
    const departure = new Date(formData.departureDate);
    const returnDate = new Date(formData.returnDate);
    if (departure >= returnDate) {
      errors.returnDate = 'La fecha de regreso debe ser posterior a la de salida';
    }
  }

  if (!formData.price || formData.price <= 0) {
    errors.price = 'El precio debe ser mayor a 0';
  }

  return errors;
};

export const validateBookingForm = (formData) => {
  const errors = {};

  if (!formData.userId) {
    errors.userId = 'Selecciona un usuario';
  }

  if (!formData.tripId) {
    errors.tripId = 'Selecciona un viaje';
  }

  if (!formData.boardType) {
    errors.boardType = 'Selecciona el tipo de pensión';
  }

  return errors;
};

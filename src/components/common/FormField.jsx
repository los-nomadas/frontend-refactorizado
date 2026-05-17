import React from 'react';
import { FormError } from './Feedback';

const FormField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required,
  options,
  className = '',
  ...rest
}) => {
  const inputClasses = `w-full px-4 py-2 border rounded ${
    error ? 'border-red-500 bg-red-50' : 'border-gray-300'
  } ${className}`;

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-semibold mb-2">
          {label}
          {required && <span className="text-red-600"> *</span>}
        </label>
      )}
      
      {type === 'textarea' ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={inputClasses}
          {...rest}
        />
      ) : type === 'select' ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={inputClasses}
          {...rest}
        >
          <option value="">Seleccionar...</option>
          {options?.map((option) => (
            <option key={option.id || option.value} value={option.id || option.value}>
              {option.label || option.name}
            </option>
          ))}
        </select>
      ) : type === 'checkbox' ? (
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name={name}
            checked={value || false}
            onChange={onChange}
            className="w-4 h-4"
            {...rest}
          />
          <span className="text-sm">{label}</span>
        </label>
      ) : (
        <input
          type={type}
          name={name}
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
          className={inputClasses}
          required={required}
          {...rest}
        />
      )}
      
      {error && <FormError message={error} />}
    </div>
  );
};

export default FormField;

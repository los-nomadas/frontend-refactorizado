const Button = ({ 
  children, 
  onClick, 
  className = '', 
  variant = 'primary', 
  type = 'button',
  disabled = false,
  size = 'md',
}) => {
  const baseSizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const baseClasses = 'rounded font-medium transition-all duration-200 font-semibold';
  
  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white disabled:bg-primary-300 shadow-md hover:shadow-lg',
    success: 'bg-success-500 hover:bg-success-600 active:bg-success-700 text-white disabled:bg-green-300 shadow-md hover:shadow-lg',
    danger: 'bg-danger-600 hover:bg-danger-700 active:bg-red-800 text-white disabled:bg-red-300 shadow-md hover:shadow-lg',
    secondary: 'bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-gray-800 disabled:bg-gray-100 shadow-sm hover:shadow-md',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-blue-50 active:bg-blue-100 disabled:border-gray-300 disabled:text-gray-400',
  };

  const sizeClass = baseSizes[size] || baseSizes.md;
  const variantClass = variants[variant] || variants.primary;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizeClass} ${variantClass} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;

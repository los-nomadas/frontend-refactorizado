const Button = ({ 
  children, 
  onClick, 
  className = '', 
  variant = 'primary', 
  type = 'button',
  disabled = false 
}) => {
  const baseClasses = 'px-4 py-2 rounded font-medium transition';
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-400',
    success: 'bg-green-600 hover:bg-green-700 text-white disabled:bg-green-400',
    danger: 'bg-red-600 hover:bg-red-700 text-white disabled:bg-red-400',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 disabled:bg-gray-100',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;

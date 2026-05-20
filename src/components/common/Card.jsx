const Card = ({
  children,
  className = '',
  shadow = 'md',
  border = true,
  padding = 'lg',
  hoverEffect = false,
}) => {
  const shadowMap = {
    xs: 'shadow-xs',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };

  const paddingMap = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  };

  const borderClass = border ? 'border border-gray-200' : '';
  const hoverClass = hoverEffect ? 'hover:shadow-lg transition-shadow duration-300' : '';
  const shadowClass = shadowMap[shadow] || shadowMap.md;
  const paddingClass = paddingMap[padding] || paddingMap.lg;

  return (
    <div
      className={`
        bg-white rounded-lg ${borderClass} ${shadowClass} ${paddingClass} ${hoverClass} ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;

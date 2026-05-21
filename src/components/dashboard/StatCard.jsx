const StatCard = ({ title, value, subtitle, icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-white border-blue-200 text-blue-600',
    green: 'bg-white border-green-200 text-green-600',
    purple: 'bg-white border-purple-200 text-purple-600',
    amber: 'bg-white border-amber-200 text-amber-600',
    red: 'bg-white border-red-200 text-red-600',
    indigo: 'bg-white border-indigo-200 text-indigo-600',
  };

  const iconBg = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    amber: 'bg-amber-100 text-amber-600',
    red: 'bg-red-100 text-red-600',
    indigo: 'bg-indigo-100 text-indigo-600',
  };

  return (
    <div
      className={`rounded-lg border-2 ${colorClasses[color] || colorClasses.blue} p-5 md:p-6 transition-all duration-200 hover:shadow-md shadow-sm`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-grow">
          <p className="text-xs md:text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl md:text-3xl font-bold mt-2 text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {icon && (
          <div className={`rounded-lg p-2 md:p-3 flex-shrink-0 ${iconBg[color] || iconBg.blue}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;

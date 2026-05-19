export const Loading = () => (
  <div className="flex justify-center items-center p-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

export const Alert = ({ type = 'info', message, onClose }) => {
  const colors = {
    success: 'bg-green-100 text-green-800 border-green-300',
    error: 'bg-red-100 text-red-800 border-red-300',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    info: 'bg-blue-100 text-blue-800 border-blue-300',
  };

  return (
    <div className={`border rounded p-4 mb-4 flex justify-between items-center ${colors[type]}`}>
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} className="ml-4 font-bold">
          ✕
        </button>
      )}
    </div>
  );
};

export const FormError = ({ message }) => {
  if (!message) return null;
  return <p className="text-red-600 text-sm mt-1">{message}</p>;
};

export const EmptyState = ({ message = 'No hay datos disponibles' }) => (
  <div className="text-center py-12 text-gray-500">
    <p className="text-lg">{message}</p>
  </div>
);

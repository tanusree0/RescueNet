import { MapPin, RefreshCw } from 'lucide-react';

export default function LocationPrompt({ error, onRetry }) {
  if (!error) return null;

  const messages = {
    PERMISSION_DENIED: 'Location access was denied. Please allow it to receive rescue alerts and track your position.',
    POSITION_UNAVAILABLE: 'Could not get your location. Check if GPS/location services are on.',
    TIMEOUT: 'Location request timed out. Please try again.',
    NOT_SUPPORTED: 'Location is not supported by your browser.',
    UNKNOWN: 'Could not get location. Please try again.',
  };

  return (
    <div className="mb-4 p-4 rounded-2xl bg-amber-50 border border-amber-200">
      <div className="flex items-start gap-3">
        <MapPin className="text-amber-600 flex-shrink-0 mt-0.5" size={24} />
        <div>
          <p className="font-semibold text-amber-800">Location required</p>
          <p className="text-sm text-amber-700 mt-1">{messages[error] || messages.UNKNOWN}</p>
          <p className="text-xs text-amber-600 mt-2">
            <strong>To enable:</strong> Click the lock/info icon in the address bar → Site settings → Location → Allow
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600 transition"
            >
              <RefreshCw size={16} /> Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

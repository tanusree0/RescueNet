import { useState, useEffect, useCallback } from 'react';

const DEFAULT_COORDS = { lat: 0, lng: 0 };

export const useLocation = (options = {}) => {
  const { watch = false, enableHighAccuracy = true } = options;
  const [coords, setCoords] = useState(DEFAULT_COORDS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const requestLocation = useCallback(() => {
    setLoading(true);
    setError(null);

    const onSuccess = (pos) => {
      setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      setLoading(false);
      setError(null);
    };

    const onError = (err) => {
      setLoading(false);
      setCoords(DEFAULT_COORDS);
      if (err.code === 1) {
        setError('PERMISSION_DENIED');
      } else if (err.code === 2) {
        setError('POSITION_UNAVAILABLE');
      } else if (err.code === 3) {
        setError('TIMEOUT');
      } else {
        setError('UNKNOWN');
      }
    };

    const geoOptions = {
      enableHighAccuracy,
      timeout: 15000,
      maximumAge: 0,
    };

    if (watch) {
      const id = navigator.geolocation.watchPosition(onSuccess, onError, geoOptions);
      return () => navigator.geolocation.clearWatch(id);
    }
    navigator.geolocation.getCurrentPosition(onSuccess, onError, geoOptions);
  }, [watch, enableHighAccuracy]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('NOT_SUPPORTED');
      setLoading(false);
      return;
    }
    const cleanup = requestLocation();
    return cleanup;
  }, [requestLocation]);

  return { coords, loading, error, refresh: requestLocation };
};

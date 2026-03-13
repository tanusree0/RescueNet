import { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLocation } from '../../hooks/useLocation';
import { useSocket } from '../../context/SocketContext';
import MapView from '../../components/MapView';
import LocationPrompt from '../../components/LocationPrompt';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { completeIncident } from '../../services/incidentService';

export default function Navigation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const socket = useSocket();
  const { coords, error: locError, refresh: refreshLocation } = useLocation({ watch: true });
  const lastSent = useRef(0);

  useEffect(() => {
    if (!socket || !id || !coords.lat || !coords.lng) return;
    const now = Date.now();
    if (now - lastSent.current < 3000) return;
    lastSent.current = now;
    socket.emit('update_volunteer_location', { incidentId: id, lat: coords.lat, lng: coords.lng });
  }, [socket, id, coords.lat, coords.lng]);

  const handleArrived = async () => {
    try {
      await completeIncident(id, false);
      alert('Rescue completed! Thank you for helping.');
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update');
    }
  };

  const handleFakeReport = async () => {
    if (!window.confirm('Mark this as a false/fake report? The reporter\'s trust score will be reduced.')) return;
    try {
      await completeIncident(id, true);
      alert('Report marked as fake. Thank you for the feedback.');
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Rescue Navigation</h1>
        <p className="text-gray-500">Your location is shared with the reporter in real-time</p>
      </div>

      <LocationPrompt error={locError} onRetry={refreshLocation} />

      <MapView 
        lat={coords.lat || 23.83} 
        lng={coords.lng || 91.27} 
        zoom={15}
        height="320px"
      />

      <div className="grid grid-cols-2 gap-4 mt-8">
        <button 
          onClick={handleArrived}
          className="bg-emerald-500 hover:bg-emerald-600 text-white p-6 rounded-3xl font-bold shadow-lg shadow-emerald-100 flex flex-col items-center gap-2 transition"
        >
          <CheckCircle size={32} /> Animal Rescued
        </button>
        <button 
          onClick={handleFakeReport}
          className="bg-white border-2 border-red-200 text-red-600 hover:bg-red-50 p-6 rounded-3xl font-bold flex flex-col items-center gap-2 transition"
        >
          <AlertTriangle size={32} /> False Report
        </button>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import IncidentCard from '../../components/IncidentCard';
import LocationPrompt from '../../components/LocationPrompt';
import { acceptIncident, getNearbyIncidents } from '../../services/incidentService';
import { updateMyLocation } from '../../services/userService';
import { useLocation } from '../../hooks/useLocation';

export default function VolunteerDashboard() {
  const [incidents, setIncidents] = useState([]);
  const navigate = useNavigate();
  const socket = useSocket();
  const { user } = useAuth();
  const { coords, error: locError, refresh: refreshLocation } = useLocation();

  useEffect(() => {
    if (socket && user?._id) {
      socket.emit('join_volunteer_room', user._id);
    }
  }, [socket, user?._id]);

  useEffect(() => {
    if (user?.role !== 'volunteer' || !coords.lat || !coords.lng) return;
    updateMyLocation(coords.lat, coords.lng)
      .then(() => getNearbyIncidents(coords.lat, coords.lng))
      .then((res) => {
        if (res?.data?.length) {
          setIncidents(prev => {
            const ids = new Set(prev.map(i => i.incidentId ?? i._id));
            const newOnes = res.data.filter(i => !ids.has(i.incidentId ?? i._id));
            return [...newOnes, ...prev];
          });
        }
      })
      .catch(() => {});
  }, [user?.role, coords.lat, coords.lng]);

  useEffect(() => {
    if (!socket) return;
    const handler = (data) => setIncidents(prev => [data, ...prev]);
    socket.on('NEW_EMERGENCY', handler);
    return () => socket.off('NEW_EMERGENCY', handler);
  }, [socket]);

  const handleAccept = async (incidentId) => {
    try {
      await acceptIncident(incidentId);
      setIncidents(prev => prev.filter(i => (i.incidentId ?? i._id) !== incidentId));
      navigate(`/navigate/${incidentId}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to accept');
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-2 text-gray-800">Nearby Rescue Requests</h1>
        <p className="text-gray-500 mb-4">You'll receive alerts for incidents within 5km</p>
        <LocationPrompt error={locError} onRetry={refreshLocation} />
        <div className="space-y-4">
          {incidents.map(inc => (
            <IncidentCard 
              key={inc.incidentId ?? inc._id} 
              incident={inc} 
              onAccept={handleAccept} 
            />
          ))}
          {incidents.length === 0 && (
            <div className="py-20 text-center bg-white rounded-3xl border border-gray-100">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
                <span className="text-4xl">🐾</span>
              </div>
              <p className="text-gray-500 font-medium">Searching for reports nearby...</p>
              <p className="text-gray-400 text-sm mt-1">Stay online to receive alerts</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

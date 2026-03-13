import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MapView from '../../components/MapView';
import { useSocketEvents } from '../../hooks/useSocket';
import { useSocket } from '../../context/SocketContext';
import { useState } from 'react';

export default function LiveTracking() {
  const { id } = useParams();
  const socket = useSocket();
  const [rescuerPos, setRescuerPos] = useState(null);
  const [volunteerInfo, setVolunteerInfo] = useState(null);

  useEffect(() => {
    if (socket && id) {
      socket.emit('join_rescue_room', id);
    }
  }, [socket, id]);

  useSocketEvents('rescuer_position_update', (data) => {
    setRescuerPos(data);
  });

  useSocketEvents('RESCUE_ACCEPTED', (data) => {
    setVolunteerInfo(data);
  });

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Volunteer is en route!</h1>
      <div className="bg-emerald-50 p-4 rounded-2xl mb-6 flex items-center gap-4 border border-emerald-100">
        <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold animate-pulse">
          {volunteerInfo?.name?.[0] ?? '?'}
        </div>
        <div>
          <p className="text-emerald-800 font-semibold">
            {volunteerInfo?.name ?? 'Waiting for volunteer...'} has accepted your request
          </p>
          <p className="text-emerald-600 text-sm">Live GPS tracking active</p>
        </div>
      </div>
      <MapView 
        lat={23.83} 
        lng={91.27} 
        rescuerPos={rescuerPos}
        height="400px"
      />
      <p className="mt-4 text-center text-gray-500 text-sm">
        Rescuer location updates in real-time
      </p>
    </div>
  );
}

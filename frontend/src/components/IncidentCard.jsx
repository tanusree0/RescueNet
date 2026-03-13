import { MapPin, Clock } from 'lucide-react';

export default function IncidentCard({ incident, onAccept }) {
  const incidentId = incident.incidentId ?? incident._id;
  const animalType = incident.animalType || 'Animal';
  const imageUrl = incident.imageUrl || 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop';
  const [lng, lat] = incident.location || [0, 0];

  return (
    <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex gap-4 transition hover:shadow-lg">
      <img 
        src={imageUrl} 
        alt={`Injured ${animalType}`} 
        className="w-24 h-24 rounded-2xl object-cover shadow-sm flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-bold text-lg text-gray-800">Injured {animalType}</h3>
          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-bold flex-shrink-0">
            NEW
          </span>
        </div>
        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
          <MapPin size={14} className="text-amber-500 flex-shrink-0"/>
          Nearby
        </p>
        <button 
          onClick={() => onAccept(incidentId)}
          className="mt-3 w-full bg-amber-500 hover:bg-amber-600 text-white py-2.5 rounded-xl text-sm font-bold active:scale-[0.98] transition"
        >
          Accept Rescue
        </button>
      </div>
    </div>
  );
}

import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { images } from '../assets/images';

const defaultIcon = L.icon({ 
  iconUrl: images.mapPin || 'https://cdn-icons-png.flaticon.com/512/684/684908.png', 
  iconSize: [38, 38] 
});

export default function MapView({ lat, lng, rescuerPos, height = '256px', zoom = 13 }) {
  const center = rescuerPos ? [rescuerPos.lat, rescuerPos.lng] : [lat, lng];

  return (
    <div className="w-full rounded-3xl overflow-hidden shadow-md" style={{ height }}>
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
        key={rescuerPos ? `${rescuerPos.lat}-${rescuerPos.lng}` : 'static'}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[lat, lng]} icon={defaultIcon} />
        {rescuerPos && (
          <Marker 
            position={[rescuerPos.lat, rescuerPos.lng]} 
            icon={L.divIcon({
              className: 'rescuer-marker',
              html: '<div style="width:24px;height:24px;background:#10b981;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>',
              iconSize: [24, 24],
            })}
          />
        )}
      </MapContainer>
    </div>
  );
}

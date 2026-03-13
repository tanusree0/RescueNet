import { useNavigate } from 'react-router-dom';
import { AlertCircle, MapPin, History } from 'lucide-react';

export default function ReporterHome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] p-6 bg-gradient-to-b from-amber-50 to-white">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => navigate('/report-history')}
          className="flex items-center gap-2 px-4 py-2 text-amber-700 font-semibold hover:bg-amber-100 rounded-xl transition"
        >
          <History size={20} /> My Reports
        </button>
      </div>
      <div className="max-w-lg mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Emergency Panel</h1>
        <p className="text-gray-600 mb-10">Found an injured animal? Report it now and we'll notify rescuers within 5km</p>
        <button 
          onClick={() => navigate('/report')}
          className="group relative flex flex-col items-center justify-center w-72 h-72 mx-auto bg-red-50 border-4 border-red-500 rounded-full hover:bg-red-100 hover:scale-105 transition-all duration-300 shadow-2xl shadow-red-200/50"
        >
          <AlertCircle size={80} className="text-red-500 mb-4 group-hover:animate-pulse" />
          <span className="text-red-600 font-black text-xl tracking-wide">SOS REPORT</span>
        </button>
        <p className="mt-10 text-gray-500 flex items-center justify-center gap-2">
          <MapPin size={18} className="text-amber-500" /> Location will be shared automatically
        </p>
      </div>
    </div>
  );
}

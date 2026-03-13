import { Bell, X } from 'lucide-react';

export default function Notification({ message, onClose }) {
  return (
    <div className="fixed bottom-5 right-5 z-[5000] bg-white border-l-4 border-amber-500 shadow-2xl p-4 rounded-xl flex items-center gap-4 animate-bounce">
      <div className="bg-amber-100 p-2 rounded-full flex-shrink-0">
        <Bell className="text-amber-600" size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-800">New Rescue Alert!</p>
        <p className="text-xs text-gray-500 truncate">{message}</p>
      </div>
      <button 
        onClick={onClose} 
        className="text-gray-400 hover:text-gray-600 flex-shrink-0 p-1"
        aria-label="Close"
      >
        <X size={16} />
      </button>
    </div>
  );
}

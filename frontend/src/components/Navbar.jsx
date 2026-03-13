import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PawPrint, LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-sm sticky top-0 z-[1000]">
      <Link 
        to="/" 
        className="text-2xl font-bold text-amber-600 flex items-center gap-2 hover:text-amber-700 transition"
      >
        <PawPrint size={28} />
        RescuePaw
      </Link>
      <div className="flex gap-6 items-center flex-wrap">
        <Link to="/" className="text-gray-600 hover:text-gray-900 font-medium">Home</Link>
        <Link to="/#about" className="text-gray-600 hover:text-amber-600 font-medium">About</Link>
        <Link to="/#testimonials" className="text-gray-600 hover:text-amber-600 font-medium">Testimonials</Link>
        <Link to="/#contact" className="text-gray-600 hover:text-amber-600 font-medium">Contact</Link>
        {user ? (
          <>
            <Link to={user.role === 'reporter' ? '/report-home' : '/dashboard'} className="text-amber-600 font-semibold hover:underline">
              {user.role === 'reporter' ? 'Report' : 'Dashboard'}
            </Link>
            {user.role === 'reporter' && (
              <Link to="/report-history" className="text-gray-600 hover:text-amber-600 font-medium">
                History
              </Link>
            )}
            <span className="text-sm text-gray-500 hidden sm:inline">
              {user.name} (Trust: {user.trustScore ?? 100})
            </span>
            <button 
              onClick={() => { logout(); navigate('/'); }} 
              className="text-red-500 flex items-center gap-1 hover:text-red-600 font-medium"
            >
              <LogOut size={18} /> Logout
            </button>
          </>
        ) : (
          <Link 
            to="/login" 
            className="bg-amber-500 text-white px-5 py-2 rounded-full font-semibold hover:bg-amber-600 transition"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

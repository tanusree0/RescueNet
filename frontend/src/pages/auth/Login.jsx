import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import { PawPrint } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', { email, password });
      login(data);
      data.role === 'volunteer' ? navigate('/dashboard') : navigate('/report-home');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-gradient-to-b from-amber-50 to-white">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-2xl mb-4">
            <PawPrint className="text-amber-600" size={36} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Welcome to RescuePaw</h2>
          <p className="text-gray-500 mt-1">Sign in to continue</p>
        </div>
        <form 
          onSubmit={handleSubmit} 
          className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100"
        >
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm">
              {error}
            </div>
          )}
          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            required
            className="w-full mb-4 p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none" 
            onChange={e => setEmail(e.target.value)} 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            required
            className="w-full mb-6 p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none" 
            onChange={e => setPassword(e.target.value)} 
          />
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-70 text-white py-4 rounded-2xl font-bold transition"
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
          <p className="mt-4 text-center text-gray-600">
            New here? <Link to="/register" className="text-amber-600 font-semibold hover:underline">Create account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

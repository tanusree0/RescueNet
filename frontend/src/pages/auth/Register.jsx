import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../services/api';
import { Heart, Shield } from 'lucide-react';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'reporter' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await API.post('/auth/register', form);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-gradient-to-b from-amber-50 to-white py-12">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Join the Mission</h2>
        <form 
          onSubmit={handleSubmit} 
          className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100"
        >
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>
          )}
          <input 
            type="text" 
            placeholder="Full Name" 
            value={form.name}
            required
            className="w-full mb-4 p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none" 
            onChange={e => setForm({...form, name: e.target.value})} 
          />
          <input 
            type="email" 
            placeholder="Email" 
            value={form.email}
            required
            className="w-full mb-4 p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none" 
            onChange={e => setForm({...form, email: e.target.value})} 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={form.password}
            required
            minLength={6}
            className="w-full mb-4 p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none" 
            onChange={e => setForm({...form, password: e.target.value})} 
          />
          <label className="block text-sm font-medium text-gray-700 mb-2">I want to</label>
          <div className="flex gap-4 mb-6">
            <button
              type="button"
              onClick={() => setForm({...form, role: 'reporter'})}
              className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-2xl border-2 transition ${
                form.role === 'reporter' 
                  ? 'border-amber-500 bg-amber-50 text-amber-700' 
                  : 'border-gray-200 text-gray-600 hover:border-amber-300'
              }`}
            >
              <Shield size={20} /> Report incidents
            </button>
            <button
              type="button"
              onClick={() => setForm({...form, role: 'volunteer'})}
              className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-2xl border-2 transition ${
                form.role === 'volunteer' 
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                  : 'border-gray-200 text-gray-600 hover:border-emerald-300'
              }`}
            >
              <Heart size={20} /> Rescue animals
            </button>
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-70 text-white py-4 rounded-2xl font-bold transition"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
          <p className="mt-4 text-center text-gray-600">
            Already have an account? <Link to="/login" className="text-amber-600 font-semibold hover:underline">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

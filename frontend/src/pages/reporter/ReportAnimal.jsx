import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, Loader2 } from 'lucide-react';
import API from '../../services/api';
import { useLocation } from '../../hooks/useLocation';
import LocationPrompt from '../../components/LocationPrompt';

const ANIMAL_TYPES = ['Dog', 'Cat', 'Cow', 'Bird', 'Other'];

export default function ReportAnimal() {
  const { coords, loading: locLoading, error: locError, refresh: refreshLocation } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const submitReport = async (e) => {
    e.preventDefault();
    setError('');
    if (!file) {
      setError('Please upload a photo of the injured animal');
      return;
    }
    if (!coords.lat || !coords.lng) {
      setError('Please allow location access to report');
      return;
    }
    setLoading(true);
    const fd = new FormData();
    fd.append('image', file);
    fd.append('animalType', e.target.animalType?.value || 'Other');
    fd.append('latitude', coords.lat);
    fd.append('longitude', coords.lng);

    try {
      const res = await API.post('/incidents', fd);
      const incidentId = res.data?.data?._id ?? res.data?.data?.id ?? res.data?._id;
      navigate(incidentId ? `/track/${incidentId}` : '/report-home');
    } catch (err) {
      setError(err.response?.data?.message || 'Report failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2 text-gray-800">Emergency Details</h1>
      <p className="text-gray-500 mb-6">Add photo and details to report an injured animal</p>
      <form onSubmit={submitReport} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Animal Type</label>
          <select 
            name="animalType" 
            className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
            required
          >
            {ANIMAL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Photo Evidence (Required)</label>
          <div className="border-2 border-dashed border-gray-200 p-8 text-center rounded-2xl hover:border-amber-400 transition">
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileChange} 
              required 
              className="hidden"
              id="photo-upload"
            />
            <label htmlFor="photo-upload" className="cursor-pointer block">
              {preview ? (
                <img src={preview} alt="Preview" className="mx-auto max-h-40 rounded-xl object-cover" />
              ) : (
                <Camera className="mx-auto text-gray-400 mb-2" size={48} />
              )}
              <span className="text-sm text-gray-500">
                {file ? file.name : 'Click to upload photo'}
              </span>
            </label>
          </div>
        </div>
        <LocationPrompt error={locError} onRetry={refreshLocation} />
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <MapPin size={16} className="text-amber-500" />
          {coords.lat && coords.lng ? 'Location captured' : locLoading ? 'Getting your location...' : locError ? 'Enable location to report' : 'Getting your location...'}
        </div>
        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>
        )}
        <button 
          type="submit"
          disabled={loading || !coords.lat || !coords.lng || locError}
          className="w-full bg-red-500 hover:bg-red-600 disabled:opacity-70 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition"
        >
          {loading ? <><Loader2 className="animate-spin" size={24} /> Submitting...</> : 'SUBMIT EMERGENCY'}
        </button>
      </form>
    </div>
  );
}

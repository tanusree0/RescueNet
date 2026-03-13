import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { History, MapPin, User, Mail, Heart, Send, X } from 'lucide-react';
import { getMyReports, sendThankYou } from '../../services/incidentService';

const statusColors = {
  pending: 'bg-amber-100 text-amber-800',
  accepted: 'bg-blue-100 text-blue-800',
  'on-site': 'bg-indigo-100 text-indigo-800',
  completed: 'bg-emerald-100 text-emerald-800',
  fake: 'bg-red-100 text-red-800',
};

const formatDate = (d) => {
  const dt = new Date(d);
  return dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) + ' ' + dt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
};

export default function ReportHistory() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [thankModal, setThankModal] = useState(null);
  const [thankNote, setThankNote] = useState('');
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();

  const loadReports = () => {
    setLoading(true);
    setError(null);
    getMyReports()
      .then((res) => {
        const list = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
        setReports(list);
      })
      .catch((err) => {
        setReports([]);
        setError(err.response?.status === 401 ? 'Please login again' : 'Could not load reports');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadReports(); }, []);

  const handleSendThankYou = async () => {
    if (!thankModal) return;
    setSending(true);
    try {
      await sendThankYou(thankModal._id, thankNote);
      setThankModal(null);
      setThankNote('');
      loadReports();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send thank you');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <History size={28} /> My Reports
          </h1>
          <p className="text-gray-500 mt-1">Your reported incidents and who rescued them</p>
        </div>
        <button
          onClick={loadReports}
          disabled={loading}
          className="px-4 py-2 text-amber-600 font-medium hover:bg-amber-50 rounded-xl disabled:opacity-60"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-gray-100">
          <p className="text-red-600 mb-2">{error}</p>
          <button onClick={loadReports} className="text-amber-600 font-semibold hover:underline">Try again</button>
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-gray-100">
          <History className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500">No reports yet</p>
          <p className="text-sm text-gray-400 mt-2">Reports you submit will appear here</p>
          <button
            onClick={() => navigate('/report')}
            className="mt-4 text-amber-600 font-semibold hover:underline"
          >
            Report an incident
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((r) => {
            const rescuer = r.assignedRescuer;
            const [lng, lat] = r.location?.coordinates ?? [0, 0];
            const showThankYou = r.status === 'completed' && rescuer && !r.thankYouNote;

            return (
              <div
                key={r._id}
                className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="flex gap-4">
                  <img
                    src={r.imageUrl}
                    alt={r.animalType}
                    className="w-20 h-20 rounded-2xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <h3 className="font-bold text-gray-800">Injured {r.animalType}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[r.status] || 'bg-gray-100'}`}>
                        {r.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{formatDate(r.createdAt)}</p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <MapPin size={12} /> {lat.toFixed(4)}, {lng.toFixed(4)}
                    </p>
                    {rescuer && r.status === 'completed' && (
                      <div className="mt-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                        <p className="text-sm font-semibold text-emerald-800 flex items-center gap-1">
                          <User size={14} /> Rescued by {rescuer.name}
                        </p>
                        <p className="text-xs text-emerald-700 flex items-center gap-1 mt-1">
                          <Mail size={12} /> {rescuer.email}
                        </p>
                        {showThankYou ? (
                          <button
                            onClick={() => setThankModal(r)}
                            className="mt-2 flex items-center gap-1 text-amber-600 font-semibold text-sm hover:underline"
                          >
                            <Heart size={14} /> Send thank you (email both)
                          </button>
                        ) : r.thankYouNote ? (
                          <p className="mt-2 text-xs text-emerald-600 italic">Thank you sent ✓</p>
                        ) : null}
                      </div>
                    )}
                    {r.status === 'pending' && (
                      <button
                        onClick={() => navigate(`/track/${r._id}`)}
                        className="mt-2 text-amber-600 text-sm font-medium hover:underline"
                      >
                        Track rescue
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {thankModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => !sending && setThankModal(null)}>
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-gray-800">Thank the rescuer</h3>
              <button onClick={() => !sending && setThankModal(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <p className="text-sm text-gray-600 mb-3">A thank you email will be sent to you and <strong>{thankModal.assignedRescuer?.name}</strong>.</p>
            <textarea
              value={thankNote}
              onChange={e => setThankNote(e.target.value)}
              placeholder="Write a note of thanks (optional)..."
              className="w-full p-3 border rounded-2xl mb-4 min-h-[80px] resize-none"
              rows={3}
            />
            <div className="flex gap-3">
              <button
                onClick={handleSendThankYou}
                disabled={sending}
                className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl font-semibold disabled:opacity-70"
              >
                <Send size={18} /> {sending ? 'Sending...' : 'Send thank you'}
              </button>
              <button
                onClick={() => !sending && setThankModal(null)}
                className="px-4 py-3 border rounded-xl text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ItineraryCard from '../components/ItineraryCard';
import { itineraryAPI, uploadAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [itineraries, setItineraries] = useState([]);
  const [uploadCount, setUploadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchData = async () => {
    try {
      const [itinerariesRes, uploadsRes] = await Promise.all([
        itineraryAPI.getAll(),
        uploadAPI.getAll(),
      ]);
      setItineraries(itinerariesRes.data);
      setUploadCount(uploadsRes.data.length);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const upcomingCount = itineraries.filter((it) => {
    const end = it.endDate ? new Date(it.endDate) : null;
    return end && end >= new Date();
  }).length;

  const handleDelete = async (id) => {
    try {
      await itineraryAPI.delete(id);
      setItineraries((prev) => prev.filter((it) => it._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete itinerary');
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="rounded-2xl overflow-hidden premium-shadow">
          <div className="gradient-bg px-6 py-8 sm:px-10 sm:py-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-emerald-300 text-sm font-medium">Dashboard</p>
                <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-white">
                  Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'},{' '}
                  <span className="text-emerald-300">{user?.name?.split(' ')[0] || 'traveler'}</span>
                </h1>
                <p className="mt-2 text-slate-300 text-sm">
                  Your trips and travel documents at a glance.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/upload')}
                className="btn-primary px-5 py-3 rounded-lg text-white font-semibold text-sm hover:opacity-95"
              >
                + New Trip
              </button>
            </div>
          </div>
        </section>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-600">Total Trips</p>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-700">
                ✈
              </span>
            </div>
            <p className="mt-2 text-3xl font-extrabold text-slate-900">{itineraries.length}</p>
          </div>
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-600">Upcoming</p>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-700">
                📅
              </span>
            </div>
            <p className="mt-2 text-3xl font-extrabold text-slate-900">{upcomingCount}</p>
          </div>
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-600">Docs Uploaded</p>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-700">
                📄
              </span>
            </div>
            <p className="mt-2 text-3xl font-extrabold text-slate-900">{uploadCount}</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          </div>
        ) : itineraries.length === 0 ? (
          <div className="mt-8 card p-10 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700 text-2xl">
              🧭
            </div>
            <h3 className="text-lg font-bold text-slate-900">No trips yet</h3>
            <p className="mt-1 text-sm text-slate-500">
              Upload travel documents and generate your first AI itinerary in minutes.
            </p>
            <button
              type="button"
              onClick={() => navigate('/upload')}
              className="btn-primary mt-6 px-5 py-3 rounded-lg text-white font-semibold text-sm"
            >
              Upload your first document
            </button>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {itineraries.map((itinerary) => (
              <ItineraryCard key={itinerary._id} itinerary={itinerary} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

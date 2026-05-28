import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import DayCard from '../components/DayCard';
import { itineraryAPI } from '../services/api';

const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

const SharedItinerary = () => {
  const { shareId } = useParams();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchShared = async () => {
      try {
        const { data } = await itineraryAPI.getShared(shareId);
        setItinerary(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Itinerary not found');
      } finally {
        setLoading(false);
      }
    };
    fetchShared();
  }, [shareId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  if (error || !itinerary) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <p className="text-red-600 text-center">{error || 'Itinerary not found'}</p>
        <Link to="/register" className="btn-primary mt-6 px-5 py-3 rounded-lg text-white font-semibold text-sm">
          Plan your own trip
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="gradient-bg">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <div
                style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                aria-hidden="true"
              >
                ✈
              </div>
              <span
                style={{
                  background: 'linear-gradient(135deg, #10B981, #6EE7B7)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
                className="text-xl font-extrabold"
              >
                TripMind
              </span>
            </div>

            <Link
              to="/register"
              className="btn-primary px-5 py-3 rounded-lg text-white font-semibold text-sm w-full sm:w-auto text-center"
            >
              Plan your own trip
            </Link>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl px-5 py-4">
            <p className="text-emerald-300 text-sm font-medium">Shared itinerary</p>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-white">{itinerary.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-white">
                {itinerary.destination}
              </span>
              <span className="text-slate-300 text-sm">
                {formatDate(itinerary.startDate)} — {formatDate(itinerary.endDate)}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-500/10 px-5 py-4 text-slate-800">
          <p className="text-sm">
            Inspired by this trip?{' '}
            <Link to="/register" className="font-semibold text-emerald-700 underline">
              Create your own itinerary
            </Link>
          </p>
        </div>

        <div className="space-y-4">
          {itinerary.days?.map((day) => (
            <DayCard key={day.dayNumber} day={day} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default SharedItinerary;

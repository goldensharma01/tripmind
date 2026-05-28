import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import DayCard from '../components/DayCard';
import { itineraryAPI } from '../services/api';

const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

const ItineraryDetail = () => {
  const { id } = useParams();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const { data } = await itineraryAPI.getById(id);
        setItinerary(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load itinerary');
      } finally {
        setLoading(false);
      }
    };
    fetchItinerary();
  }, [id]);

  const shareUrl = itinerary
    ? `${window.location.origin}/share/${itinerary.shareId}`
  : '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      prompt('Copy this link:', shareUrl);
    }
  };

  const handleExport = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex justify-center py-24">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
        </div>
      </div>
    );
  }

  if (error || !itinerary) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="mx-auto max-w-3xl px-4 py-12 text-center text-red-600">
          {error || 'Not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="rounded-2xl overflow-hidden premium-shadow">
          <div className="gradient-bg px-6 py-8 sm:px-10 sm:py-10">
            <p className="text-emerald-300 text-sm font-medium">Itinerary</p>
            <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-white">{itinerary.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-white">
                {itinerary.destination}
              </span>
              <span className="text-slate-300 text-sm">
                {formatDate(itinerary.startDate)} — {formatDate(itinerary.endDate)}
              </span>
            </div>

            <div className="no-print mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleExport}
                className="px-4 py-2 rounded-lg bg-white/10 text-white text-sm font-semibold hover:bg-white/15 transition-colors"
              >
                Export PDF
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="btn-primary px-4 py-2 rounded-lg text-white text-sm font-semibold hover:opacity-95"
              >
                {copied ? 'Copied!' : 'Copy share link'}
              </button>
            </div>
          </div>
        </section>

        <div className="no-print mt-6 rounded-2xl border border-emerald-200 bg-emerald-500/10 px-5 py-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-bold text-emerald-800">Share link</p>
            <p className="mt-1 truncate text-sm text-emerald-900/80">{shareUrl}</p>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="btn-primary px-4 py-2 rounded-lg text-white text-sm font-semibold hover:opacity-95"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        <div className="mt-8 space-y-4">
          {itinerary.days && itinerary.days.length > 0 ? (
            itinerary.days.map((day) => <DayCard key={day.dayNumber} day={day} />)
          ) : (
            <div className="rounded-2xl bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] border border-slate-100 p-10 text-center text-slate-600">
              No days in this itinerary.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItineraryDetail;

import { useNavigate } from 'react-router-dom';

const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const ItineraryCard = ({ itinerary, onDelete }) => {
  const navigate = useNavigate();
  const end = itinerary.endDate ? new Date(itinerary.endDate) : null;
  const isPast = end ? end < new Date() : false;
  const badge = isPast ? 'Past' : 'Upcoming';

  const shareUrl = `${window.location.origin}/share/${itinerary.shareId}`;

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('Share link copied to clipboard!');
    } catch {
      prompt('Copy this link:', shareUrl);
    }
  };

  const handleExport = () => {
    navigate(`/itinerary/${itinerary._id}`);
    setTimeout(() => window.print(), 500);
  };

  const handleDelete = () => {
    if (window.confirm('Delete this itinerary?')) {
      onDelete(itinerary._id);
    }
  };

  return (
    <div className="group rounded-xl bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] border border-slate-100 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="h-full w-1 bg-emerald-500" />
      <div className="flex flex-1 flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <h3 className="truncate text-lg font-semibold text-slate-900">{itinerary.title}</h3>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              isPast
                ? 'bg-slate-100 text-slate-600'
                : 'bg-emerald-500/10 text-emerald-700'
            }`}
          >
            {badge}
          </span>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
            {itinerary.destination}
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          {formatDate(itinerary.startDate)} — {formatDate(itinerary.endDate)}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => navigate(`/itinerary/${itinerary._id}`)}
          className="btn-primary px-4 py-2 rounded-lg text-white text-sm font-semibold hover:opacity-95"
        >
          View
        </button>
        <button
          type="button"
          onClick={handleShare}
          className="px-4 py-2 rounded-lg text-sm font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Share
        </button>
        <button
          type="button"
          onClick={handleExport}
          className="px-4 py-2 rounded-lg text-sm font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Export
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="px-4 py-2 rounded-lg text-sm font-semibold border border-red-200 bg-white text-red-600 hover:bg-red-50 transition-colors"
        >
          Delete
        </button>
      </div>
      </div>
    </div>
  );
};

export default ItineraryCard;

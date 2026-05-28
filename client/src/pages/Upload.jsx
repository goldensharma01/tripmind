import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import FileDropzone from '../components/FileDropzone';
import ExtractionPreview from '../components/ExtractionPreview';
import { uploadAPI, itineraryAPI } from '../services/api';

const Upload = () => {
  const [uploads, setUploads] = useState([]);
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(3);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchUploads = async () => {
    try {
      const { data } = await uploadAPI.getAll();
      setUploads(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load uploads');
    }
  };

  useEffect(() => {
    fetchUploads();
  }, []);

  const handleFileDrop = async (file) => {
    setError('');
    setUploading(true);

    const formData = new FormData();
    formData.append('document', file);

    try {
      const { data } = await uploadAPI.upload(formData);
      setUploads((prev) => [data, ...prev]);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await uploadAPI.delete(id);
      setUploads((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete upload');
    }
  };

  const handleGenerate = async () => {
    setError('');
    const doneUploads = uploads.filter((u) => u.status === 'done');

    if (doneUploads.length === 0) {
      setError('Upload at least one processed document first');
      return;
    }

    if (!destination.trim()) {
      setError('Please enter a destination');
      return;
    }

    setGenerating(true);

    try {
      const { data } = await itineraryAPI.generate({
        uploadIds: doneUploads.map((u) => u._id),
        destination: destination.trim(),
        days: Number(days),
      });
      navigate(`/itinerary/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate itinerary');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 min-w-0">
        <div className="rounded-2xl overflow-hidden premium-shadow min-w-0">
          <div className="gradient-bg px-6 py-8 sm:px-10 sm:py-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Upload documents</h1>
            <p className="mt-2 text-slate-300 text-sm max-w-2xl">
              Drop flight tickets, hotel bookings, or travel PDFs. We’ll extract details and build a premium itinerary.
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-8">
          <div className="card p-6 overflow-hidden">
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Add a travel document</h2>
                <p className="text-sm text-slate-500">PDF, JPG, PNG — up to 10MB</p>
              </div>
              {uploading && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                  Extracting…
                </div>
              )}
            </div>
            <div className="rounded-2xl border-2 border-dashed border-emerald-500/40 bg-emerald-500/5 p-4 hover:bg-emerald-500/10 transition-colors">
              <FileDropzone onFileDrop={handleFileDrop} disabled={uploading} />
            </div>
          </div>
        </div>

        {uploads.length > 0 && (
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="card p-6 overflow-hidden min-w-0">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Your uploads</h2>
                <span className="text-sm text-slate-500">{uploads.length} file(s)</span>
              </div>
              <div className="space-y-4">
                {uploads.map((upload) => (
                  <div key={upload._id} className="rounded-xl border border-slate-100 p-4">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <p className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-900">
                        {upload.originalName}
                      </p>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          upload.status === 'done'
                            ? 'bg-emerald-500/10 text-emerald-700'
                            : upload.status === 'processing' || upload.status === 'pending'
                              ? 'bg-amber-500/10 text-amber-700'
                              : 'bg-red-500/10 text-red-700'
                        }`}
                      >
                        {upload.status}
                      </span>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleDelete(upload._id)}
                        className="text-sm font-semibold text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-slate-900/95 backdrop-blur text-white shadow-[0_20px_60px_rgba(15,23,42,0.25)] border border-white/10 p-6 overflow-hidden min-w-0">
              <h2 className="text-lg font-bold">Extraction preview</h2>
              <p className="mt-1 text-sm text-slate-300">
                Latest extracted fields from your uploaded document(s).
              </p>
              <div className="mt-4 space-y-4">
                {uploads.slice(0, 2).map((upload) => (
                  <div key={upload._id} className="rounded-xl bg-white/5 border border-white/10 p-4">
                    <ExtractionPreview
                      extractedData={upload.extractedData}
                      status={upload.status}
                      originalName={upload.originalName}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-10 card p-6 overflow-hidden">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Generate itinerary</h2>
              <p className="mt-1 text-sm text-slate-500">
                Turn extracted bookings into a detailed day-by-day itinerary.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="destination" className="mb-2 block text-sm font-semibold text-slate-700">
                Destination
              </label>
              <input
                id="destination"
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Paris, France"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label htmlFor="days" className="mb-2 block text-sm font-semibold text-slate-700">
                Number of days
              </label>
              <input
                id="days"
                type="number"
                min={1}
                max={30}
                value={days}
                onChange={(e) => setDays(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating}
            className="btn-primary mt-6 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-white font-semibold text-sm hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {generating && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            {generating ? 'Generating...' : 'Generate Itinerary'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Upload;

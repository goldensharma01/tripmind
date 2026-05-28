const FIELD_LABELS = {
  flightNumber: 'Flight Number',
  airline: 'Airline',
  origin: 'Origin',
  destination: 'Destination',
  departureDate: 'Departure Date',
  departureTime: 'Departure Time',
  arrivalTime: 'Arrival Time',
  passengerName: 'Passenger',
  hotelName: 'Hotel',
  checkIn: 'Check-in',
  checkOut: 'Check-out',
  bookingRef: 'Booking Ref',
  documentType: 'Document Type',
};

const ExtractionPreview = ({ extractedData, status, originalName }) => {
  const isProcessing = status === 'pending' || status === 'processing';
  const isFailed = status === 'failed';

  if (isProcessing) {
    return (
      <div className="card animate-pulse">
        <div className="mb-3 h-4 w-1/3 rounded bg-gray-200" />
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-3 rounded bg-gray-100" />
          ))}
        </div>
        <p className="mt-4 text-sm text-gray-500">Processing extraction…</p>
      </div>
    );
  }

  if (isFailed) {
    return (
      <div className="card border-red-100 bg-red-50">
        <p className="font-medium text-red-700">{originalName || 'Document'}</p>
        <p className="mt-1 text-sm text-red-600">Extraction failed. Try uploading again.</p>
      </div>
    );
  }

  const data = extractedData || {};
  const entries = Object.entries(FIELD_LABELS).filter(
    ([key]) => data[key] && String(data[key]).trim() !== ''
  );

  return (
    <div className="card w-full min-w-0 overflow-hidden">
      <div className="mb-4 flex items-center justify-between gap-2 min-w-0">
        <p className="min-w-0 truncate font-medium text-gray-900">
          {originalName || 'Extracted data'}
        </p>
        {data.documentType && (
          <span className="rounded-full bg-accent-light px-2.5 py-0.5 text-xs font-medium text-accent">
            {data.documentType}
          </span>
        )}
      </div>
      {entries.length === 0 ? (
        <p className="text-sm text-gray-500">No fields extracted from this document.</p>
      ) : (
        <dl className="grid gap-3 sm:grid-cols-2">
          {entries.map(([key, label]) => (
            <div key={key}>
              <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">
                {label}
              </dt>
              <dd className="mt-0.5 text-sm text-gray-900 break-words [overflow-wrap:anywhere]">
                {data[key]}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
};

export default ExtractionPreview;

const DayCard = ({ day }) => {
  return (
    <div className="card">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
          {day.dayNumber}
        </span>
        <h3 className="text-lg font-semibold text-gray-900">{day.title}</h3>
      </div>
      {day.activities && day.activities.length > 0 ? (
        <ol className="space-y-3">
          {day.activities.map((activity, index) => (
            <li key={index} className="flex gap-3 text-sm text-gray-700">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600">
                {index + 1}
              </span>
              <span className="pt-0.5">{activity}</span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-sm text-gray-500">No activities listed.</p>
      )}
    </div>
  );
};

export default DayCard;

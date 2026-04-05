export default function SightingList({ sightings }) {
  if (!sightings || sightings.length === 0) {
    return (
      <p className="mt-6 text-sm text-gray-500">No nearby activity reported</p>
    );
  }

  const timeAgo = (date) => {
    if (!date) return "just now";

    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr ago`;

    return `${Math.floor(seconds / 86400)} day ago`;
  };

  return (
    <div className="mt-6 w-full">
      <h2 className="text-lg font-semibold mb-2">Nearby Activity</h2>

      <p className="text-xs text-gray-500 mb-3">Reports from nearby users</p>

      {sightings.map((s) => (
        <div
          key={s._id}
          className="bg-slate-800 p-3 rounded-xl mb-3 hover:bg-slate-700 transition"
        >
          <p className="text-sm text-gray-400">
            @{s.username} • {timeAgo(s.createdAt)}
          </p>

          <p className="text-sm mt-1">{s.note}</p>
        </div>
      ))}
    </div>
  );
}

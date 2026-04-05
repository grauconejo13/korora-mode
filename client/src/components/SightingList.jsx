export default function SightingList({ sightings }) {
  if (!sightings || sightings.length === 0) {
    return (
      <p className="mt-6 text-sm text-gray-500">No nearby activity reported</p>
    );
  }

  return (
    <div className="mt-6 w-full">
      <h2 className="text-lg font-semibold mb-2">Nearby Activity</h2>

      <p className="text-xs text-gray-500 mb-3">Reports from nearby users</p>

      {sightings.map((s) => (
        <div
          key={s.id}
          className="bg-slate-800 p-3 rounded-xl mb-3 hover:bg-slate-700 transition"
        >
          <p className="text-sm text-gray-400">
            @{s.username} • {new Date(s.timestamp).toLocaleTimeString()}
          </p>

          <p className="text-sm mt-1">{s.note}</p>
        </div>
      ))}
    </div>
  );
}

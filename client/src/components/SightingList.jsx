export default function SightingList({ sightings }) {
  return (
    <div className="mt-6 w-full max-w-md">
      <h2 className="font-bold mb-2">Recent Sightings</h2>

      {sightings.map((s) => (
        <div className="bg-slate-800 p-3 rounded-xl mb-2">
          <p className="text-sm text-gray-400">
            @{s.username} • {new Date(s.timestamp).toLocaleTimeString()}
          </p>

          <p className="font-semibold">{s.species}</p>

          <p className="text-sm mt-1">{s.note}</p>
        </div>
      ))}
    </div>
  );
}

import { useState } from "react";

export default function SightingForm({ onAdd, species, location }) {
  const [note, setNote] = useState("");
  const [username, setUsername] = useState("");

  const handleSubmit = () => {
    if (!species || !note || !username) return;

    const newSighting = {
      id: Date.now(),
      species,
      note,
      username,
      lat: location?.lat,
      lng: location?.lng,
      timestamp: new Date().toISOString(),
    };

    onAdd(newSighting);

    setNote("");
    setUsername("");
  };

  return (
    <div className="mt-6 w-full max-w-md bg-slate-800 p-4 rounded-xl">
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        className="w-full p-2 rounded text-black mb-2"
      />

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="What’s happening nearby? (e.g. coyote near trail, aggressive dog, etc.)"
        className="w-full p-2 rounded text-black"
      />

      <button
        onClick={handleSubmit}
        className="mt-2 bg-green-500 px-4 py-2 rounded-xl"
      >
        Submit Sighting
      </button>
    </div>
  );
}

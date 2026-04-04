import { useState } from "react";

export default function SightingForm({ onAdd, species, location }) {
  const [note, setNote] = useState("");

  const handleSubmit = () => {
    if (!species) return;

    const newSighting = {
      id: Date.now(),
      species,
      note,
      lat: location?.lat,
      lng: location?.lng,
      timestamp: new Date().toISOString(),
    };

    onAdd(newSighting);
    setNote("");
  };

  return (
    <div className="mt-4 w-full max-w-md">
      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="What did you observe?"
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

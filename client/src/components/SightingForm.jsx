import { useState } from "react";

export default function SightingForm({ onAdd, species, location }) {
  const [note, setNote] = useState("");
  const [username, setUsername] = useState("");

  const handleSubmit = async () => {
    if (!species || !note || !username) return;

    const newSighting = {
      species,
      note,
      username,
      lat: location?.lat,
      lng: location?.lng,
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/sightings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSighting),
      });

      const saved = await res.json();

      // update UI with backend response
      onAdd(saved);

      setNote("");
      setUsername();
    } catch (err) {
      console.error("Failed to save sighting", err);
    }
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

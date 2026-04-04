import { useState } from "react";
import { fetchWildlife } from "./services/wildlifeApi";
import { getAIAdvice } from "./services/aiService";
import { addSighting } from "./services/sightingsService";
import { getLocationName } from "./services/locationService";
import { getRiskLevel } from "./utils/kororaLogic";

import RiskCard from "./components/RiskCard";
import SightingForm from "./components/SightingForm";
import SightingList from "./components/SightingList";

export default function App() {
  const [location, setLocation] = useState(null);
  const [place, setPlace] = useState(null);
  const [error, setError] = useState(null);
  const [species, setSpecies] = useState(null);
  const [category, setCategory] = useState(null);
  const [risk, setRisk] = useState(null);
  const [advisory, setAdvisory] = useState(null);
  const [sightings, setSightings] = useState([]);

  const formatCategory = (cat) => {
    if (cat === "Aves") return "Bird";
    if (cat === "Mammalia") return "Mammal";
    if (cat === "Reptilia") return "Reptile";
    if (cat === "Insecta") return "Insect";
    if (cat === "Arachnida") return "Arachnid";
    return cat || "Unknown";
  };

  const handleCheck = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        // immediate UI updates
        setLocation({ lat, lng });
        setError(null);
        setSpecies("Checking nearby wildlife...");
        setAdvisory(null);
        setRisk(null);
        setCategory(null);

        // get readable place
        const placeName = await getLocationName(lat, lng);
        setPlace(placeName);

        try {
          const results = await fetchWildlife(lat, lng);

          if (results.length > 0) {
            const random = results[Math.floor(Math.random() * results.length)];

            const detectedSpecies =
              random.species_guess ||
              random.taxon?.preferred_common_name ||
              random.taxon?.name ||
              "Unknown wildlife";

            const rawCategory = random.taxon?.iconic_taxon_name;
            const formattedCategory = formatCategory(rawCategory);

            setSpecies(detectedSpecies);
            setCategory(formattedCategory);

            const calculatedRisk = getRiskLevel(
              detectedSpecies,
              formattedCategory,
            );
            setRisk(calculatedRisk);

            setAdvisory("Generating guidance...");
            const aiText = await getAIAdvice(detectedSpecies);
            setAdvisory(aiText);
          } else {
            setSpecies("No recent wildlife activity nearby");
            setRisk("LOW");
          }
        } catch (err) {
          console.error(err);
          setError("Failed to fetch wildlife data");
        }
      },
      () => {
        setError("Permission denied or unavailable");
      },
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">🐧 Kororā Mode</h1>

      {/* Check button */}
      <button
        onClick={handleCheck}
        className="bg-blue-500 px-4 py-2 rounded-xl"
      >
        Check Nearby Wildlife
      </button>

      {/* Location */}
      {location && (
        <div className="mt-4 text-sm">
          <p>Latitude: {location.lat}</p>
          <p>Longitude: {location.lng}</p>
        </div>
      )}

      {place && <p className="mt-2 text-sm text-gray-400">📍 {place}</p>}

      {/* Species */}
      {species && (
        <div className="mt-6 w-full max-w-md bg-slate-800 p-4 rounded-xl">
          <p className="text-sm text-gray-400">Detected Species</p>
          <p className="text-lg font-semibold">{species}</p>

          {category && (
            <p className="text-sm text-gray-400 mt-1">Type: {category}</p>
          )}
        </div>
      )}

      {/* Risk */}
      <RiskCard risk={risk} />

      {/* AI Advisory */}
      {advisory && (
        <div className="mt-4 w-full max-w-md bg-blue-500/20 p-4 rounded-xl">
          <p className="font-semibold">🧠 AI Guidance</p>
          <p className="text-sm mt-2">{advisory}</p>
        </div>
      )}

      {/* Form */}
      <SightingForm
        species={species}
        location={location}
        onAdd={(newSighting) => addSighting(setSightings, newSighting)}
      />

      {/* Feed */}
      <SightingList sightings={sightings} />

      {/* Error */}
      {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}
    </div>
  );
}

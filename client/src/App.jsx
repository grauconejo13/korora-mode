import { useState, useEffect } from "react";
import { fetchWildlife } from "./services/wildlifeApi";
import { getAIAdvice } from "./services/aiService";
import { addSighting } from "./services/sightingsService";
import { getLocationName } from "./services/locationService";
import { getRiskLevel } from "./utils/kororaLogic";
import Header from "./components/Header";
import RiskCard from "./components/RiskCard";
import SightingForm from "./components/SightingForm";
import SightingList from "./components/SightingList";

export default function App() {
  const [location, setLocation] = useState(null);
  const [place, setPlace] = useState(null);
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);
  const [species, setSpecies] = useState(null);
  const [category, setCategory] = useState(null);
  const [risk, setRisk] = useState(null);
  const [advisory, setAdvisory] = useState(null);
  const [sightings, setSightings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [view, setView] = useState("scan");
  const [loading, setLoading] = useState(true);

  const formatCategory = (cat) => {
    if (cat === "Aves") return "Bird";
    if (cat === "Mammalia") return "Mammal";
    if (cat === "Reptilia") return "Reptile";
    if (cat === "Insecta") return "Insect";
    if (cat === "Arachnida") return "Arachnid";
    return cat || "Unknown";
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const loadSightings = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/sightings`);
      const data = await res.json();
      setSightings(data);
    };

    loadSightings();
  }, []);

  const handleCheck = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setLocation({ lat, lng });
        setError(null);
        setSpecies("Checking nearby wildlife...");
        setImage(null);
        setAdvisory(null);
        setRisk(null);
        setCategory(null);

        const placeName = await getLocationName(lat, lng);
        setPlace(placeName);

        try {
          const results = await fetchWildlife(lat, lng);

          if (results.length > 0) {
            const random = results[Math.floor(Math.random() * results.length)];

            const photoUrl = random.photos?.[0]?.url;

            if (photoUrl) {
              setImage(photoUrl.replace("square", "medium"));
            }

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

  //SPLASH SCREEN
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-900">
        <img
          src="https://assets.codepen.io/11990995/Koror%C4%81-Mode-logo.png"
          alt="Kororā Mode"
          className="w-3/4 max-w-lg"
        />
      </div>
    );
  }

  //Main App
  return (
    <div className="min-h-screen bg-slate-900 text-white flex justify-center px-4">
      <div className="w-full max-w-xl py-6">
        <Header
          onMenuClick={() => setShowModal(true)}
          onSwitchView={() => setView(view === "scan" ? "activity" : "scan")}
          onInfoClick={() => setShowInfo(true)}
          view={view}
        />

        {view === "scan" && (
          <>
            <button
              onClick={handleCheck}
              className="bg-blue-500 px-4 py-2 rounded-xl"
            >
              Check Nearby Wildlife
            </button>

            {location && (
              <p className="mt-2 text-sm text-gray-400">
                📍 {place} • {Math.abs(location.lat).toFixed(1)}°{" "}
                {location.lat >= 0 ? "N" : "S"},{" "}
                {Math.abs(location.lng).toFixed(1)}°{" "}
                {location.lng >= 0 ? "E" : "W"}
              </p>
            )}

            <div className="mt-6 space-y-3">
              {image && (
                <img
                  src={image}
                  alt={species}
                  className="w-full h-48 object-cover rounded-xl"
                />
              )}

              {species && (
                <div className="bg-slate-800 p-4 rounded-xl">
                  <p className="text-sm text-gray-400">Detected Species</p>
                  <p className="text-lg font-semibold">{species}</p>
                  {category && (
                    <p className="text-sm text-gray-400 mt-1">
                      Type: {category}
                    </p>
                  )}
                </div>
              )}
            </div>

            <RiskCard risk={risk} className="mt-4" />

            {advisory && (
              <div className="mt-4 bg-blue-500/20 p-4 rounded-xl">
                <p className="font-semibold">🧠 AI Guidance</p>
                <pre className="text-sm mt-2 whitespace-pre-wrap font-sans">
                  {advisory}
                </pre>
              </div>
            )}
          </>
        )}

        {view === "activity" && <SightingList sightings={sightings} />}

        {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}

        {showInfo && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-slate-800 p-6 rounded-xl w-full max-w-md">
              <button onClick={() => setShowInfo(false)}>✕</button>
              <h2 className="text-lg font-semibold mb-2">🐧 What is Kororā?</h2>
              <p className="text-sm text-gray-300">
                Inspired by the little penguin—small, observant, and impossible
                to miss.
              </p>
            </div>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-slate-800 p-6 rounded-xl w-full max-w-md">
              <button onClick={() => setShowModal(false)}>✕</button>

              <SightingForm
                location={location}
                onAdd={(newSighting) => {
                  addSighting(setSightings, newSighting);
                  setShowModal(false);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

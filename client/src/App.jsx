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

  const formatCategory = (cat) => {
    if (cat === "Aves") return "Bird";
    if (cat === "Mammalia") return "Mammal";
    if (cat === "Reptilia") return "Reptile";
    if (cat === "Insecta") return "Insect";
    if (cat === "Arachnida") return "Arachnid";
    return cat || "Unknown";
  };

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

        // immediate UI updates
        setLocation({ lat, lng });
        setError(null);
        setSpecies("Checking nearby wildlife...");
        setImage(null);
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

            const photoUrl = random.photos?.[0]?.url;

            if (photoUrl) {
              setImage(photoUrl.replace("square", "medium"));
            } else {
              setImage(null);
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
            {/* Check button */}
            <button
              onClick={handleCheck}
              className="bg-blue-500 px-4 py-2 rounded-xl"
            >
              Check Nearby Wildlife
            </button>

            {/* Location */}
            {location && (
              <div className="mt-4 text-sm text-gray-400">
                <p className="mt-2 text-sm text-gray-400">
                  📍 {place} • {Math.abs(location.lat).toFixed(1)}°{" "}
                  {location.lat >= 0 ? "N" : "S"},{" "}
                  {Math.abs(location.lng).toFixed(1)}°{" "}
                  {location.lng >= 0 ? "E" : "W"}
                </p>
              </div>
            )}

            <div className="mt-6 space-y-3">
              {image && (
                <img
                  src={image}
                  alt={species}
                  className="w-full h-48 object-cover rounded-xl mb-2"
                />
              )}
              {/* Species */}
              {species && (
                <div className="w-full bg-slate-800 p-4 rounded-xl">
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

            {/* Risk */}
            <RiskCard risk={risk} className="mt-4" />

            {/* AI Advisory */}
            {advisory && (
              <div className="mt-4 w-full bg-blue-500/20 p-4 rounded-xl">
                <p className="font-semibold">🧠 AI Guidance</p>
                <pre className="text-sm mt-2 whitespace-pre-wrap font-sans">
                  {advisory}
                </pre>
              </div>
            )}
          </>
        )}

        {/* Feed */}
        {view === "activity" && (
          <>
            <SightingList sightings={sightings} />
          </>
        )}

        {/* Error */}
        {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}

        {showInfo && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-slate-800 p-6 rounded-xl w-full max-w-md">
              <button className="mb-4" onClick={() => setShowInfo(false)}>
                ✕
              </button>

              <h2 className="text-lg font-semibold mb-2">🐧 What is Kororā?</h2>

              <p className="text-sm text-gray-300 mb-3">
                Inspired by the little penguin—small, observant, and impossible
                to miss.
              </p>

              <p className="text-sm text-gray-300 mb-3">
                Kororā (the Māori name for the little penguin) represents
                awareness—the ability to quietly observe and understand your
                surroundings.
              </p>

              <p className="text-sm text-gray-300 mb-3">
                Kororā Mode helps you notice what’s around you, understand
                potential risks, and stay one step ahead.
              </p>

              <p className="text-sm text-gray-300">This app helps you:</p>

              <ul className="text-sm text-gray-300 mt-2 space-y-1">
                <li>• Identify nearby wildlife</li>
                <li>• Understand potential risk levels</li>
                <li>• See activity reported by nearby users</li>
              </ul>

              <p className="text-sm text-gray-400 mt-4">
                Stay aware. Stay curious.
              </p>
            </div>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-slate-800 p-6 rounded-xl w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold">📝 Report Nearby Activity</h2>
                <button onClick={() => setShowModal(false)}>✕</button>
              </div>

              <SightingForm
                species={species}
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

export const getRiskLevel = (species, category) => {
  if (!species) return "LOW";

  const name = species.toLowerCase();

  // 🔴 Critical threats
  if (name.includes("tiger")) return "CRITICAL";

  // 🟠 High risk animals
  if (name.includes("snake")) return "HIGH";
  if (name.includes("black widow")) return "HIGH";
  if (name.includes("brown recluse")) return "HIGH";
  if (name.includes("sea lion") || name.includes("seal")) return "HIGH";

  // 🟡 Medium risk
  if (name.includes("wolf")) return "MEDIUM";
  if (name.includes("wasp") || name.includes("hornet")) return "MEDIUM";
  if (name.includes("fire ant")) return "MEDIUM";

  // 🟢 Low risk
  if (name.includes("bee")) return "LOW";
  if (name.includes("mosquito")) return "LOW";

  // 🧠 Category fallback
  if (category === "Insect") return "NONE";
  if (category === "Arachnid") return "LOW";

  return "LOW";
};

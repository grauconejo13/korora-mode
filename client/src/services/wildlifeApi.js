export const fetchWildlife = async (lat, lng) => {
  try {
    const res = await fetch(
      `https://api.inaturalist.org/v1/observations?lat=${lat}&lng=${lng}&radius=5&per_page=5`,
    );

    const data = await res.json();

    if (data.results && data.results.length > 0) {
      return data.results;
    }

    return [];
  } catch (err) {
    console.error("Wildlife API error:", err);
    return [];
  }
};

export const getLocationName = async (lat, lng) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
    );

    const data = await res.json();

    return (
      data.address.city ||
      data.address.town ||
      data.address.state ||
      "Unknown location"
    );
  } catch (err) {
    console.error("Location error:", err);
    return "Unknown location";
  }
};

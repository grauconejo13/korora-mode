export const addSighting = (setSightings, newSighting) => {
  setSightings((prev) => [newSighting, ...prev]);
};

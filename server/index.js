import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

console.log("MONGO_URI:", process.env.MONGO_URI);
// ---- DB ----
await mongoose.connect(process.env.MONGO_URI);
console.log("MongoDB connected");

// ---- Schema ----
const sightingSchema = new mongoose.Schema({
  username: String,
  note: String,
  lat: Number,
  lng: Number,
  createdAt: { type: Date, default: Date.now },
});

const Sighting = mongoose.model("Sighting", sightingSchema);

// ---- Routes ----

// GET all sightings
app.get("/api/sightings", async (req, res) => {
  const sightings = await Sighting.find().sort({ createdAt: -1 }).limit(50);
  res.json(sightings);
});

// POST new sighting
app.post("/api/sightings", async (req, res) => {
  const { username, note, lat, lng } = req.body;

  const newSighting = new Sighting({
    username,
    note,
    lat,
    lng,
  });

  await newSighting.save();
  res.json(newSighting);
});

// ---- Start ----
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));

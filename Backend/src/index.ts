import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import requestRoutes from "./routes/request.routes";
import hospitalRoutes from "./routes/hospital.routes";
import locationRoutes from "./routes/location.routes";

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
app.use("/api/auth", authRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/hospital", hospitalRoutes);
app.use("/api/location", locationRoutes);


app.get("/", (req, res) => {
  res.json({ message: "EmergencyConnect API running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
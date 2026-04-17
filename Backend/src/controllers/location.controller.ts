import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth";

// POST /api/location — User updates their location
export const updateLocation = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { lat, lng } = req.body;

    if (!lat || !lng) {
      res.status(400).json({ message: "lat and lng required" });
      return;
    }

    const location = await prisma.location.upsert({
      where: { userId },
      update: { lat, lng },
      create: { userId, lat, lng },
    });

    res.status(200).json({ message: "Location updated", location });
  } catch (err) {
    console.error("Update location error:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

// GET /api/location/:userId — Hospital gets user's live location
export const getUserLocation = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.params.userId as string;

    const location = await prisma.location.findUnique({
      where: { userId },
    });

    if (!location) {
      res.status(404).json({ message: "Location not found" });
      return;
    }

    res.status(200).json({ location });
  } catch (err) {
    console.error("Get location error:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};
import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth";

// Helper: calculate distance between two coordinates (Haversine formula)
function getDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

// POST /api/requests — User sends ambulance request
export const createRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { lat, lng } = req.body;
    const userId = req.userId!;

    if (!lat || !lng) {
      res.status(400).json({ message: "Location required" });
      return;
    }

    // Find all hospitals
    const hospitals = await prisma.hospital.findMany();

    if (hospitals.length === 0) {
      res.status(404).json({ message: "No hospitals available" });
      return;
    }

    // Find nearest hospital using Haversine
    let nearestHospital = hospitals[0];
    let minDistance = getDistance(lat, lng, hospitals[0].lat, hospitals[0].lng);

    for (const hospital of hospitals) {
      const distance = getDistance(lat, lng, hospital.lat, hospital.lng);
      if (distance < minDistance) {
        minDistance = distance;
        nearestHospital = hospital;
      }
    }

    // Create request
    const request = await prisma.request.create({
      data: {
        userId,
        hospitalId: nearestHospital.id,
        lat,
        lng,
        status: "PENDING",
      },
      include: {
        hospital: true,
      },
    });

    res.status(201).json({
      message: "Request sent successfully",
      request,
      distanceKm: minDistance.toFixed(2),
    });
  } catch (err) {
    console.error("Create request error:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

// GET /api/requests/my — User sees their own requests
export const getMyRequests = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const requests = await prisma.request.findMany({
      where: { userId },
      include: { hospital: true },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ requests });
  } catch (err) {
    console.error("Get requests error:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};
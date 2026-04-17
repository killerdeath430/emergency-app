import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth";

// GET /api/hospital/requests — Hospital sees all its requests
export const getHospitalRequests = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    // Find hospital profile of logged in user
    const hospital = await prisma.hospital.findUnique({
      where: { userId },
    });

    if (!hospital) {
      res.status(404).json({ message: "Hospital profile not found" });
      return;
    }

    const requests = await prisma.request.findMany({
      where: { hospitalId: hospital.id },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ requests });
  } catch (err) {
    console.error("Get hospital requests error:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

// PATCH /api/hospital/requests/:id — Accept or Reject a request
export const updateRequestStatus = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const id = req.params.id as string;
    const { status } = req.body;

    if (!["ACCEPTED", "REJECTED", "COMPLETED"].includes(status)) {
      res.status(400).json({ message: "Invalid status" });
      return;
    }

    // Verify this request belongs to this hospital
    const hospital = await prisma.hospital.findUnique({
      where: { userId },
    });

    if (!hospital) {
      res.status(404).json({ message: "Hospital profile not found" });
      return;
    }

    const request = await prisma.request.findUnique({
      where: { id },
    });

    if (!request) {
      res.status(404).json({ message: "Request not found" });
      return;
    }

    if (request.hospitalId !== hospital.id) {
      res.status(403).json({ message: "Not authorized" });
      return;
    }

    const updated = await prisma.request.update({
      where: { id },
      data: { status },
    });

    res.status(200).json({ message: `Request ${status}`, request: updated });
  } catch (err) {
    console.error("Update request error:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

// GET /api/hospital/profile — Hospital sees its own profile
export const getHospitalProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const hospital = await prisma.hospital.findUnique({
      where: { userId },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!hospital) {
      res.status(404).json({ message: "Hospital profile not found" });
      return;
    }

    res.status(200).json({ hospital });
  } catch (err) {
    console.error("Get hospital profile error:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};
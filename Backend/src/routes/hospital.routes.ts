import { Router } from "express";
import {
  getHospitalRequests,
  updateRequestStatus,
  getHospitalProfile,
} from "../controllers/hospital.controller";
import { protect } from "../middleware/auth";

const router = Router();

router.get("/profile", protect, getHospitalProfile);
router.get("/requests", protect, getHospitalRequests);
router.patch("/requests/:id", protect, updateRequestStatus);

export default router;
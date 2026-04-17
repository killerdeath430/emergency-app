import { Router } from "express";
import { updateLocation, getUserLocation } from "../controllers/location.controller";
import { protect } from "../middleware/auth";

const router = Router();

router.post("/", protect, updateLocation);
router.get("/:userId", protect, getUserLocation);

export default router;
import { Router } from "express";
import { createRequest, getMyRequests } from "../controllers/request.controller";
import { protect } from "../middleware/auth";

const router = Router();

router.post("/", protect, createRequest);
router.get("/my", protect, getMyRequests);

export default router;
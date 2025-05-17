import express from "express";
import {
  createVendor,
  getAllVendors,
  mapUserToVendor,
} from "../controllers/vendor.controller";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware";

const router = express.Router();


router.get("/", authenticate, authorizeRoles("USER", "ADMIN", "VENDOR"), getAllVendors);
router.post("/", authenticate, authorizeRoles("ADMIN"), createVendor); 

router.post("/assign", authenticate, authorizeRoles("USER", "ADMIN", "VENDOR"), mapUserToVendor);

export default router;

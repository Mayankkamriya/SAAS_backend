import express from "express";
import {
  createVendor,
  getAllVendors,
  mapUserToVendor,
} from "../controllers/vendor.controller";

const router = express.Router();

router.post("/", createVendor);
router.get("/", getAllVendors);
router.post("/assign", mapUserToVendor);

export default router;

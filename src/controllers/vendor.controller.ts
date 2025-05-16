import { Request, Response } from "express";
import * as vendorService from "../services/vendor.service";

export const createVendor = async (req: Request, res: Response): Promise<void> => {
  try {
    const vendor = await vendorService.createVendor(req.body);
    res.status(201).json({ message: "Vendor created", vendor });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllVendors = async (_req: Request, res: Response): Promise<void> => {
  try {
    const vendors = await vendorService.getVendors();
    res.status(200).json({ vendors });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch vendors" });
  }
};

export const mapUserToVendor = async (req: Request, res: Response): Promise<void> => {
  const { userId, vendorCode } = req.body;

  if (!userId || !vendorCode) {
    res.status(400).json({ error: "userId and vendorCode are required" });
    return;
  }

  try {
    const user = await vendorService.assignVendorToUser(userId, vendorCode);
    res.status(200).json({ message: "User assigned to vendor", user });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

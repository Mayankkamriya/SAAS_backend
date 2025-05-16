import { Request, Response } from "express";
import * as vendorService from "../services/vendor.service";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


export const createVendor = async (req: Request, res: Response): Promise<void> => {  
  try {
    const { vendorCode, shopName, address, phoneNumber, description, appointmentSlots, services } = req.body;

    if (!vendorCode || !shopName || !address || !phoneNumber) {
       res.status(400).json({ error: "All fields are required" });
    }

    if (!services || !Array.isArray(services) || services.length === 0) {
       res.status(400).json({ error: "At least one service is required" });
    }
    for (const service of services) {
      if (!service.name || typeof service.price !== 'number') {
         res.status(400).json({ error: "Each service must have a valid name and price" });
      }
    }

    // Create vendor with services & appointment slots
    const vendor = await prisma.vendor.create({
      data: {
        vendorCode,
        shopName,
        address,
        phoneNumber,
        description,
        appointmentSlots,
        services: {
          create: services.map((service: { name: string; price: number }) => ({
            name: service.name,
            price: service.price,
          })),
        },
      },
      include: {
        services: true,
      },
    });

    res.status(201).json({
      message: "Vendor created successfully",
      vendor,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || "Failed to create vendor" });
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

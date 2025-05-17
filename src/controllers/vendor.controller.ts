import { Request, Response } from "express";
import * as vendorService from "../services/vendor.service";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


export const createVendor = async (req: Request, res: Response): Promise<void> => {  
  try {
    const { vendorCode, shopName, address, phoneNumber, description ,appointmentSlots, services } = req.body;

    if (!vendorCode || !shopName || !address || !phoneNumber ) {
       res.status(400).json({ error: "All fields are required" });
       return;
    }

    if (!services || !Array.isArray(services) || services.length === 0) {
       res.status(400).json({ error: "At least one service is required" });
       return;
    }
    for (const service of services) {
      if (!service.name || typeof service.price !== 'number') {
         res.status(400).json({ error: "Each service must have a valid name and price" });
         return;
      }
    }
const existingVendor = await prisma.vendor.findUnique({
  where: { vendorCode: vendorCode }
});

if (existingVendor) {
  res.status(400).json({ error: "Vendor code already exists." });
  return
}
let { price } = req.body;

// Convert to float
price = parseFloat(price);

if (isNaN(price)) {
  res.status(400).json({ error: "Invalid price value. Must be a number." });
  return
}
    // Create vendor with services & appointment slots
    const vendor = await prisma.vendor.create({
      data: {
        vendorCode,
        shopName,
        address,
        price,
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

// export const vendorLogin = async (req: Request, res: Response) => {
//   const { email, password } = req.body;

//   const user = await prisma.user.findUnique({ where: { email } });

//   if (!user || user.role !== "VENDOR") {
//     return res.status(403).json({ message: "Access denied, not a vendor" });
//   }

//   const isValid = await bcrypt.compare(password, user.password || "");
//   if (!isValid) {
//     res.status(401).json({ message: "Invalid credentials" });
//     return 
//   }

//   const token = generateToken(user);
//   res.json({ token, user });
// };

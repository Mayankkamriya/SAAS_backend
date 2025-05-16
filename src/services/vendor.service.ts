import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createVendor = async (data: any) => {
  return await prisma.vendor.create({ data });
};

export const getVendors = async () => {
  return await prisma.vendor.findMany();
};

export const getVendorByCode = async (vendorCode: string) => {
  return await prisma.vendor.findUnique({ where: { vendorCode } });
};

export const assignVendorToUser = async (userId: number, vendorCode: string) => {
  const vendor = await getVendorByCode(vendorCode);
  if (!vendor) throw new Error("Vendor not found");

  return await prisma.user.update({
    where: { id: userId },
    data: { vendorId: vendor.id },
  });
};

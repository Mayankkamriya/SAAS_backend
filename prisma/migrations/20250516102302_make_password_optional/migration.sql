-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT,
ADD COLUMN     "vendorId" INTEGER;

-- CreateTable
CREATE TABLE "Vendor" (
    "id" SERIAL NOT NULL,
    "vendorCode" CHAR(6) NOT NULL,
    "shopName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_vendorCode_key" ON "Vendor"("vendorCode");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

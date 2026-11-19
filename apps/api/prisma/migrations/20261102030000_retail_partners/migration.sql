-- CreateTable
CREATE TABLE "RetailPartner" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "logoId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RetailPartner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RetailPartner_isVisible_order_idx" ON "RetailPartner"("isVisible", "order");

-- AddForeignKey
ALTER TABLE "RetailPartner" ADD CONSTRAINT "RetailPartner_logoId_fkey" FOREIGN KEY ("logoId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


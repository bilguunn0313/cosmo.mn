-- AlterTable
ALTER TABLE "SiteSetting" ADD COLUMN     "beautyImageId" INTEGER,
ADD COLUMN     "foodImageId" INTEGER,
ADD COLUMN     "householdImageId" INTEGER;

-- AddForeignKey
ALTER TABLE "SiteSetting" ADD CONSTRAINT "SiteSetting_foodImageId_fkey" FOREIGN KEY ("foodImageId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SiteSetting" ADD CONSTRAINT "SiteSetting_beautyImageId_fkey" FOREIGN KEY ("beautyImageId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SiteSetting" ADD CONSTRAINT "SiteSetting_householdImageId_fkey" FOREIGN KEY ("householdImageId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

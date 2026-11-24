-- AlterTable
ALTER TABLE "SiteSetting" ADD COLUMN     "purposeImageId" INTEGER;

-- AddForeignKey
ALTER TABLE "SiteSetting" ADD CONSTRAINT "SiteSetting_purposeImageId_fkey" FOREIGN KEY ("purposeImageId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;


-- AlterTable
ALTER TABLE "SiteSetting" ADD COLUMN     "contactBannerImageId" INTEGER;

-- AddForeignKey
ALTER TABLE "SiteSetting" ADD CONSTRAINT "SiteSetting_contactBannerImageId_fkey" FOREIGN KEY ("contactBannerImageId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

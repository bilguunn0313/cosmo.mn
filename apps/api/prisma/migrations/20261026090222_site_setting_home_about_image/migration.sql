-- AlterTable
ALTER TABLE "SiteSetting" ADD COLUMN     "homeAboutImageId" INTEGER;

-- AddForeignKey
ALTER TABLE "SiteSetting" ADD CONSTRAINT "SiteSetting_homeAboutImageId_fkey" FOREIGN KEY ("homeAboutImageId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;


-- AlterTable
ALTER TABLE "SiteSetting" ADD COLUMN     "ceoImageId" INTEGER;

-- AddForeignKey
ALTER TABLE "SiteSetting" ADD CONSTRAINT "SiteSetting_ceoImageId_fkey" FOREIGN KEY ("ceoImageId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;


-- AlterTable
ALTER TABLE "Brand" ADD COLUMN     "showcaseImageId" INTEGER;

-- AddForeignKey
ALTER TABLE "Brand" ADD CONSTRAINT "Brand_showcaseImageId_fkey" FOREIGN KEY ("showcaseImageId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

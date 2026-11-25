-- AlterTable
ALTER TABLE "Brand" ADD COLUMN     "logoOnDarkId" INTEGER;

-- AddForeignKey
ALTER TABLE "Brand" ADD CONSTRAINT "Brand_logoOnDarkId_fkey" FOREIGN KEY ("logoOnDarkId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;


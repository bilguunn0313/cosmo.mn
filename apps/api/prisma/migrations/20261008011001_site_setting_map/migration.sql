/*
  Warnings:

  - You are about to drop the column `mapEmbedUrl` on the `SiteSetting` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SiteSetting" DROP COLUMN "mapEmbedUrl",
ADD COLUMN     "mapImageId" INTEGER,
ADD COLUMN     "mapUrl" TEXT;

-- AddForeignKey
ALTER TABLE "SiteSetting" ADD CONSTRAINT "SiteSetting_mapImageId_fkey" FOREIGN KEY ("mapImageId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

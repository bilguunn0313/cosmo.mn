/*
  Warnings:

  - You are about to drop the column `videoUrl` on the `News` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "News" DROP COLUMN "videoUrl",
ADD COLUMN     "videoId" INTEGER;

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

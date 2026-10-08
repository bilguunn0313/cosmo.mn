/*
  Warnings:

  - You are about to drop the column `type` on the `News` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "News_type_isPublished_publishedAt_idx";

-- AlterTable
ALTER TABLE "News" DROP COLUMN "type";

-- DropEnum
DROP TYPE "NewsType";

-- CreateIndex
CREATE INDEX "News_isPublished_publishedAt_idx" ON "News"("isPublished", "publishedAt");

-- DropForeignKey
ALTER TABLE "Brand" DROP CONSTRAINT "Brand_logoOnDarkId_fkey";

-- AlterTable
ALTER TABLE "Brand" DROP COLUMN "logoOnDarkId";


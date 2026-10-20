-- DropForeignKey
ALTER TABLE "SiteSetting" DROP CONSTRAINT "SiteSetting_beautyImageId_fkey";

-- DropForeignKey
ALTER TABLE "SiteSetting" DROP CONSTRAINT "SiteSetting_foodImageId_fkey";

-- DropForeignKey
ALTER TABLE "SiteSetting" DROP CONSTRAINT "SiteSetting_householdImageId_fkey";

-- AlterTable
ALTER TABLE "Brand" ADD COLUMN     "featuredOrder" INTEGER;

-- AlterTable
ALTER TABLE "SiteSetting" DROP COLUMN "beautyImageId",
DROP COLUMN "foodImageId",
DROP COLUMN "householdImageId";

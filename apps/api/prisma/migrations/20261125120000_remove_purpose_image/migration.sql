-- DropForeignKey
ALTER TABLE `SiteSetting` DROP FOREIGN KEY `SiteSetting_purposeImageId_fkey`;

-- DropIndex
DROP INDEX `SiteSetting_purposeImageId_fkey` ON `SiteSetting`;

-- AlterTable
ALTER TABLE `SiteSetting` DROP COLUMN `purposeImageId`;


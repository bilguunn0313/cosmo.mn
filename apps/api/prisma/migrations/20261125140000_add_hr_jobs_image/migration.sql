-- AlterTable
ALTER TABLE `SiteSetting` ADD COLUMN `hrJobsImageId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `SiteSetting` ADD CONSTRAINT `SiteSetting_hrJobsImageId_fkey` FOREIGN KEY (`hrJobsImageId`) REFERENCES `Media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE `BrandImage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `brandId` INTEGER NOT NULL,
    `mediaId` INTEGER NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,

    INDEX `BrandImage_brandId_order_idx`(`brandId`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BrandImage` ADD CONSTRAINT `BrandImage_brandId_fkey` FOREIGN KEY (`brandId`) REFERENCES `Brand`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BrandImage` ADD CONSTRAINT `BrandImage_mediaId_fkey` FOREIGN KEY (`mediaId`) REFERENCES `Media`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

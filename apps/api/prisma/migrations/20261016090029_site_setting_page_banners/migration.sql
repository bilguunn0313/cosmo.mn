-- AlterTable
ALTER TABLE "SiteSetting" ADD COLUMN     "aboutBannerImageId" INTEGER,
ADD COLUMN     "brandsBannerImageId" INTEGER,
ADD COLUMN     "careersBannerImageId" INTEGER,
ADD COLUMN     "mediaBannerImageId" INTEGER;

-- AddForeignKey
ALTER TABLE "SiteSetting" ADD CONSTRAINT "SiteSetting_aboutBannerImageId_fkey" FOREIGN KEY ("aboutBannerImageId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SiteSetting" ADD CONSTRAINT "SiteSetting_careersBannerImageId_fkey" FOREIGN KEY ("careersBannerImageId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SiteSetting" ADD CONSTRAINT "SiteSetting_mediaBannerImageId_fkey" FOREIGN KEY ("mediaBannerImageId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SiteSetting" ADD CONSTRAINT "SiteSetting_brandsBannerImageId_fkey" FOREIGN KEY ("brandsBannerImageId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "SiteSetting" ADD COLUMN     "valuePeopleImageId" INTEGER,
ADD COLUMN     "valueQualityImageId" INTEGER,
ADD COLUMN     "valueResponsibilityImageId" INTEGER,
ADD COLUMN     "valueSatisfactionImageId" INTEGER;

-- AddForeignKey
ALTER TABLE "SiteSetting" ADD CONSTRAINT "SiteSetting_valuePeopleImageId_fkey" FOREIGN KEY ("valuePeopleImageId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SiteSetting" ADD CONSTRAINT "SiteSetting_valueSatisfactionImageId_fkey" FOREIGN KEY ("valueSatisfactionImageId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SiteSetting" ADD CONSTRAINT "SiteSetting_valueQualityImageId_fkey" FOREIGN KEY ("valueQualityImageId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SiteSetting" ADD CONSTRAINT "SiteSetting_valueResponsibilityImageId_fkey" FOREIGN KEY ("valueResponsibilityImageId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

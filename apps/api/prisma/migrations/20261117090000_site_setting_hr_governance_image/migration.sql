-- AlterTable
ALTER TABLE "SiteSetting" ADD COLUMN     "hrGovernanceImageId" INTEGER;

-- AddForeignKey
ALTER TABLE "SiteSetting" ADD CONSTRAINT "SiteSetting_hrGovernanceImageId_fkey" FOREIGN KEY ("hrGovernanceImageId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

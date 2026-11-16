-- DropForeignKey
ALTER TABLE "SlideTranslation" DROP CONSTRAINT "SlideTranslation_slideId_fkey";

-- AlterTable
ALTER TABLE "Slide" DROP COLUMN "linkUrl";

-- DropTable
DROP TABLE "SlideTranslation";


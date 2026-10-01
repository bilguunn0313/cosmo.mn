/*
  Warnings:

  - The values [ch] on the enum `Locale` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `ImageId` on the `Slide` table. All the data in the column will be lost.
  - Added the required column `imageId` to the `Slide` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Locale_new" AS ENUM ('mn', 'en', 'zh');
ALTER TABLE "SlideTranslation" ALTER COLUMN "locale" TYPE "Locale_new" USING ("locale"::text::"Locale_new");
ALTER TABLE "ProductCategoryTranslation" ALTER COLUMN "locale" TYPE "Locale_new" USING ("locale"::text::"Locale_new");
ALTER TABLE "ProductTranslation" ALTER COLUMN "locale" TYPE "Locale_new" USING ("locale"::text::"Locale_new");
ALTER TABLE "NewsTranslation" ALTER COLUMN "locale" TYPE "Locale_new" USING ("locale"::text::"Locale_new");
ALTER TYPE "Locale" RENAME TO "Locale_old";
ALTER TYPE "Locale_new" RENAME TO "Locale";
DROP TYPE "public"."Locale_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Slide" DROP CONSTRAINT "Slide_ImageId_fkey";

-- AlterTable
ALTER TABLE "Slide" DROP COLUMN "ImageId",
ADD COLUMN     "imageId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Slide" ADD CONSTRAINT "Slide_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

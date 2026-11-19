-- AlterTable
ALTER TABLE "SiteSetting" ADD COLUMN     "mapEmbedUrl" TEXT;

UPDATE "SiteSetting" SET "mapEmbedUrl" = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2674.6!2d106.858296!3d47.897692!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5d96932b7743aa4f%3A0x7eb07d8c6b75e385!2sCosmo%20Trade%20LLC%20office!5e0!3m2!1smn!2smn!4v1762819200000!5m2!1smn!2smn' WHERE "id" = 1 AND "mapEmbedUrl" IS NULL;

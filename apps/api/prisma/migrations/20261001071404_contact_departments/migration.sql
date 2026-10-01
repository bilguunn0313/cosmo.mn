/*
  Warnings:

  - You are about to drop the `ContactMessage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "ContactMessage";

-- CreateTable
CREATE TABLE "ContactDepartment" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactDepartment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactDepartmentTranslation" (
    "id" SERIAL NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "locale" "Locale" NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ContactDepartmentTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ContactDepartmentTranslation_departmentId_locale_key" ON "ContactDepartmentTranslation"("departmentId", "locale");

-- AddForeignKey
ALTER TABLE "ContactDepartmentTranslation" ADD CONSTRAINT "ContactDepartmentTranslation_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "ContactDepartment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

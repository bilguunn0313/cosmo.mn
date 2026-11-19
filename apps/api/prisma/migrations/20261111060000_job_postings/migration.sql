-- CreateEnum
CREATE TYPE "JobDepartment" AS ENUM ('warehouse', 'sales', 'administration', 'finance', 'management', 'businessDevelopment', 'marketing', 'it');

-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('FULL_TIME', 'PART_TIME', 'SHIFT', 'CONTRACT', 'INTERNSHIP');

-- CreateEnum
CREATE TYPE "JobStage" AS ENUM ('OPEN', 'INTERVIEW', 'DECIDED');

-- CreateTable
CREATE TABLE "JobPosting" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "department" "JobDepartment" NOT NULL,
    "employmentType" "EmploymentType" NOT NULL,
    "stage" "JobStage" NOT NULL DEFAULT 'OPEN',
    "openedAt" TIMESTAMP(3) NOT NULL,
    "closesAt" TIMESTAMP(3),
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobPosting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobPostingTranslation" (
    "id" SERIAL NOT NULL,
    "jobPostingId" INTEGER NOT NULL,
    "locale" "Locale" NOT NULL,
    "title" TEXT NOT NULL,
    "location" TEXT,
    "salary" TEXT,
    "summary" TEXT,
    "duties" TEXT,
    "requirements" TEXT,
    "offers" TEXT,

    CONSTRAINT "JobPostingTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JobPosting_slug_key" ON "JobPosting"("slug");

-- CreateIndex
CREATE INDEX "JobPosting_isPublished_openedAt_idx" ON "JobPosting"("isPublished", "openedAt");

-- CreateIndex
CREATE UNIQUE INDEX "JobPostingTranslation_jobPostingId_locale_key" ON "JobPostingTranslation"("jobPostingId", "locale");

-- AddForeignKey
ALTER TABLE "JobPostingTranslation" ADD CONSTRAINT "JobPostingTranslation_jobPostingId_fkey" FOREIGN KEY ("jobPostingId") REFERENCES "JobPosting"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- CreateTable
CREATE TABLE "Milestone" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "imageId" INTEGER,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Milestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MilestoneTranslation" (
    "id" SERIAL NOT NULL,
    "milestoneId" INTEGER NOT NULL,
    "locale" "Locale" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "MilestoneTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Milestone_isVisible_year_idx" ON "Milestone"("isVisible", "year");

-- CreateIndex
CREATE UNIQUE INDEX "MilestoneTranslation_milestoneId_locale_key" ON "MilestoneTranslation"("milestoneId", "locale");

-- AddForeignKey
ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MilestoneTranslation" ADD CONSTRAINT "MilestoneTranslation_milestoneId_fkey" FOREIGN KEY ("milestoneId") REFERENCES "Milestone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

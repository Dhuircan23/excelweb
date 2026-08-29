-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "whatsapp" TEXT,
    "industry" TEXT,
    "currentProcess" TEXT NOT NULL,
    "fileCount" TEXT,
    "peopleCount" TEXT,
    "manualParts" TEXT,
    "problems" TEXT,
    "automationGoal" TEXT,
    "improvementCategories" TEXT NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadFile" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "storedName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyticsEvent" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "payload" TEXT,
    "path" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalyticsEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt");

-- CreateIndex
CREATE INDEX "Lead_email_idx" ON "Lead"("email");

-- CreateIndex
CREATE INDEX "LeadFile_leadId_idx" ON "LeadFile"("leadId");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_name_idx" ON "AnalyticsEvent"("name");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_createdAt_idx" ON "AnalyticsEvent"("createdAt");

-- AddForeignKey
ALTER TABLE "LeadFile" ADD CONSTRAINT "LeadFile_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

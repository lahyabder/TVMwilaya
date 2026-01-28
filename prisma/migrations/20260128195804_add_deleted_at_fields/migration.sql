-- AlterTable
ALTER TABLE "Allocation" ADD COLUMN "deletedAt" DATETIME;

-- AlterTable
ALTER TABLE "Branch" ADD COLUMN "deletedAt" DATETIME;

-- AlterTable
ALTER TABLE "User" ADD COLUMN "deletedAt" DATETIME;

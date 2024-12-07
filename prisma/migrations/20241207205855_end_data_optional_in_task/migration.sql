-- DropIndex
DROP INDEX "tasks_title_key";

-- AlterTable
ALTER TABLE "tasks" ALTER COLUMN "endDate" DROP NOT NULL;

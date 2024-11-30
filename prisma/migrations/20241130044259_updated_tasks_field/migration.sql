/*
  Warnings:

  - You are about to drop the column `projectId` on the `tasks` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_projectId_fkey";

-- AlterTable
ALTER TABLE "boards" ALTER COLUMN "order" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "projectId",
ALTER COLUMN "order" SET DEFAULT 0;

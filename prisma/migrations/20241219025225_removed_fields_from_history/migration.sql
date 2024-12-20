/*
  Warnings:

  - You are about to drop the column `projectId` on the `history` table. All the data in the column will be lost.
  - You are about to drop the column `taskId` on the `history` table. All the data in the column will be lost.
  - You are about to drop the column `workspaceId` on the `history` table. All the data in the column will be lost.
  - Added the required column `entityId` to the `history` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `actionType` on the `history` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Action_Type" AS ENUM ('CREATE', 'UPDATE', 'DELETE');

-- DropForeignKey
ALTER TABLE "history" DROP CONSTRAINT "history_projectId_fkey";

-- DropForeignKey
ALTER TABLE "history" DROP CONSTRAINT "history_taskId_fkey";

-- DropForeignKey
ALTER TABLE "history" DROP CONSTRAINT "history_workspaceId_fkey";

-- AlterTable
ALTER TABLE "history" DROP COLUMN "projectId",
DROP COLUMN "taskId",
DROP COLUMN "workspaceId",
ADD COLUMN     "entityId" INTEGER NOT NULL,
DROP COLUMN "actionType",
ADD COLUMN     "actionType" "Action_Type" NOT NULL;

-- DropEnum
DROP TYPE "History_Action";

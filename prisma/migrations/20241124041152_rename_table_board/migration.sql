/*
  Warnings:

  - You are about to drop the `Board` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_boardId_fkey";

-- DropTable
DROP TABLE "Board";

-- CreateTable
CREATE TABLE "boards" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "order" INTEGER,
    "theme" JSONB NOT NULL,

    CONSTRAINT "boards_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "boards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

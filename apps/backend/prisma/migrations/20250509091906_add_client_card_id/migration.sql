/*
  Warnings:

  - A unique constraint covering the columns `[clientCardId]` on the table `Card` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "clientCardId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Card_clientCardId_key" ON "Card"("clientCardId");

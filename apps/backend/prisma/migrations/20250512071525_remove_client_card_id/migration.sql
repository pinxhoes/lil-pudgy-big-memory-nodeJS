/*
  Warnings:

  - You are about to drop the column `clientCardId` on the `Card` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Card_clientCardId_key";

-- AlterTable
ALTER TABLE "Card" DROP COLUMN "clientCardId";

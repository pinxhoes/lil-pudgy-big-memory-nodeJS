/*
  Warnings:

  - You are about to drop the column `deck` on the `Game` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[chainGameId]` on the table `Game` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[wallet]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `boardSize` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_userId_fkey";

-- DropIndex
DROP INDEX "User_password_key";

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "deck",
ADD COLUMN     "boardSize" TEXT NOT NULL,
ADD COLUMN     "chainGameId" TEXT,
ADD COLUMN     "isOnChain" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "wallet" TEXT,
ALTER COLUMN "username" DROP NOT NULL,
ALTER COLUMN "password" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Card" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "imageId" INTEGER NOT NULL,
    "flipped" BOOLEAN NOT NULL DEFAULT false,
    "matched" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardTemplate" (
    "id" INTEGER NOT NULL,
    "name" TEXT,
    "imageUrl" TEXT NOT NULL,

    CONSTRAINT "CardTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Game_chainGameId_key" ON "Game"("chainGameId");

-- CreateIndex
CREATE UNIQUE INDEX "User_wallet_key" ON "User"("wallet");

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

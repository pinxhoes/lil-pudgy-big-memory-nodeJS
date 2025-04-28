/*
  Warnings:

  - You are about to drop the column `deck` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `mode` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `player1Id` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `player2Id` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `revealed` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `turn` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `winnerId` on the `Game` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Made the column `time` on table `Game` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_player1Id_fkey";

-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_player2Id_fkey";

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "deck",
DROP COLUMN "mode",
DROP COLUMN "player1Id",
DROP COLUMN "player2Id",
DROP COLUMN "revealed",
DROP COLUMN "status",
DROP COLUMN "turn",
DROP COLUMN "winnerId",
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "time" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

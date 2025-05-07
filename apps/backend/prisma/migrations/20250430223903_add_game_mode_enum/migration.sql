/*
  Warnings:

  - You are about to drop the column `time` on the `Game` table. All the data in the column will be lost.
  - Added the required column `deck` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mode` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GameMode" AS ENUM ('solo', 'timetrial', 'multiplayer');

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "time",
ADD COLUMN     "deck" JSONB NOT NULL,
ADD COLUMN     "durationMs" INTEGER,
ADD COLUMN     "mode" "GameMode" NOT NULL;

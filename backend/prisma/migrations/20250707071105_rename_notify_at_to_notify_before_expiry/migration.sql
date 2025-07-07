/*
  Warnings:

  - You are about to drop the column `isConsumable` on the `things` table. All the data in the column will be lost.
  - You are about to drop the column `notifyAt` on the `things` table. All the data in the column will be lost.
  - Added the required column `notifyBeforeExpiry` to the `things` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "things" DROP COLUMN "isConsumable",
DROP COLUMN "notifyAt",
ADD COLUMN     "notifyBeforeExpiry" INTEGER NOT NULL;

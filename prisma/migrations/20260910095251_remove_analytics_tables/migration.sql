/*
  Warnings:

  - You are about to drop the `LinkClick` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PageView` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "LinkClick" DROP CONSTRAINT "LinkClick_profileId_fkey";

-- DropForeignKey
ALTER TABLE "PageView" DROP CONSTRAINT "PageView_profileId_fkey";

-- DropTable
DROP TABLE "LinkClick";

-- DropTable
DROP TABLE "PageView";

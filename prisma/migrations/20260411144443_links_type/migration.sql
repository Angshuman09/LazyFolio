/*
  Warnings:

  - Added the required column `type` to the `links` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LinkType" AS ENUM ('X', 'INSTAGRAM', 'GITHUB', 'LINKEDIN', 'CUSTOM');

-- AlterTable
ALTER TABLE "links" ADD COLUMN     "type" "LinkType" NOT NULL;

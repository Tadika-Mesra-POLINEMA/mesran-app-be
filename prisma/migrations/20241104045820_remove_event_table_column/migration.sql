/*
  Warnings:

  - You are about to drop the column `cover_color` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `cover_type` on the `events` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `events` DROP COLUMN `cover_color`,
    DROP COLUMN `cover_type`;

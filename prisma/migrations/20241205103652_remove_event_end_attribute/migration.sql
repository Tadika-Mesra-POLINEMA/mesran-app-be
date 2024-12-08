/*
  Warnings:

  - You are about to drop the column `event_end` on the `events` table. All the data in the column will be lost.
  - Added the required column `activity_end` to the `event_activities` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `event_activities` ADD COLUMN `activity_end` DATE NOT NULL;

-- AlterTable
ALTER TABLE `events` DROP COLUMN `event_end`;

/*
  Warnings:

  - You are about to drop the column `activity_end` on the `event_activities` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `event_activities` DROP COLUMN `activity_end`;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `is_face_registered` BOOLEAN NOT NULL DEFAULT false;

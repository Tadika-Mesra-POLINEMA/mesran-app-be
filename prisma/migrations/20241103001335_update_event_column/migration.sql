/*
  Warnings:

  - You are about to drop the column `dress_id` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `target_data` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `venue` on the `events` table. All the data in the column will be lost.
  - You are about to drop the `event_dresses` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `dress` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `target_date` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `theme` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `events` DROP FOREIGN KEY `events_dress_id_fkey`;

-- AlterTable
ALTER TABLE `events` DROP COLUMN `dress_id`,
    DROP COLUMN `target_data`,
    DROP COLUMN `venue`,
    ADD COLUMN `dress` VARCHAR(30) NOT NULL,
    ADD COLUMN `location` VARCHAR(120) NOT NULL,
    ADD COLUMN `target_date` DATE NOT NULL,
    ADD COLUMN `theme` VARCHAR(50) NOT NULL,
    MODIFY `member_count` INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE `event_dresses`;

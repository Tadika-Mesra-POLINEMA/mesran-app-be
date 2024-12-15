/*
  Warnings:

  - You are about to drop the `event_notifications` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `event_notifications` DROP FOREIGN KEY `event_notifications_event_id_fkey`;

-- DropForeignKey
ALTER TABLE `event_notifications` DROP FOREIGN KEY `event_notifications_user_id_fkey`;

-- DropTable
DROP TABLE `event_notifications`;

-- CreateTable
CREATE TABLE `notifications` (
    `id` VARCHAR(191) NOT NULL,
    `sender_id` VARCHAR(191) NULL,
    `recipient_id` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `type` ENUM('MESSAGE', 'ALERT', 'REMINDER', 'CONFIRMATION') NOT NULL DEFAULT 'MESSAGE',
    `sent_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_sender_id_fkey` FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_recipient_id_fkey` FOREIGN KEY (`recipient_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the `chatroom` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `event` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `eventactivity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `eventdress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `eventnotification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `eventparticipant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `message` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `profile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `userchatroom` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `event` DROP FOREIGN KEY `Event_dressId_fkey`;

-- DropForeignKey
ALTER TABLE `event` DROP FOREIGN KEY `Event_userId_fkey`;

-- DropForeignKey
ALTER TABLE `eventactivity` DROP FOREIGN KEY `EventActivity_eventId_fkey`;

-- DropForeignKey
ALTER TABLE `eventnotification` DROP FOREIGN KEY `EventNotification_eventId_fkey`;

-- DropForeignKey
ALTER TABLE `eventnotification` DROP FOREIGN KEY `EventNotification_userId_fkey`;

-- DropForeignKey
ALTER TABLE `eventparticipant` DROP FOREIGN KEY `EventParticipant_eventId_fkey`;

-- DropForeignKey
ALTER TABLE `eventparticipant` DROP FOREIGN KEY `EventParticipant_userId_fkey`;

-- DropForeignKey
ALTER TABLE `message` DROP FOREIGN KEY `Message_roomId_fkey`;

-- DropForeignKey
ALTER TABLE `message` DROP FOREIGN KEY `Message_userId_fkey`;

-- DropForeignKey
ALTER TABLE `profile` DROP FOREIGN KEY `Profile_userId_fkey`;

-- DropForeignKey
ALTER TABLE `userchatroom` DROP FOREIGN KEY `UserChatRoom_roomId_fkey`;

-- DropForeignKey
ALTER TABLE `userchatroom` DROP FOREIGN KEY `UserChatRoom_userId_fkey`;

-- DropTable
DROP TABLE `chatroom`;

-- DropTable
DROP TABLE `event`;

-- DropTable
DROP TABLE `eventactivity`;

-- DropTable
DROP TABLE `eventdress`;

-- DropTable
DROP TABLE `eventnotification`;

-- DropTable
DROP TABLE `eventparticipant`;

-- DropTable
DROP TABLE `message`;

-- DropTable
DROP TABLE `profile`;

-- DropTable
DROP TABLE `user`;

-- DropTable
DROP TABLE `userchatroom`;

-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `phone` CHAR(13) NOT NULL,
    `password` TEXT NOT NULL,
    `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `profiles` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(50) NOT NULL,
    `firstname` VARCHAR(50) NOT NULL,
    `lastname` VARCHAR(50) NULL,

    UNIQUE INDEX `profiles_user_id_key`(`user_id`),
    UNIQUE INDEX `profiles_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event_dresses` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(30) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event_activities` (
    `id` VARCHAR(191) NOT NULL,
    `event_id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(100) NOT NULL,
    `description` TEXT NOT NULL,
    `activity_start` DATE NOT NULL,
    `activity_end` DATE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `events` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `target_data` DATE NOT NULL,
    `event_start` DATETIME(3) NOT NULL,
    `event_end` DATETIME(3) NOT NULL,
    `dress_id` VARCHAR(191) NOT NULL,
    `venue` VARCHAR(120) NOT NULL,
    `member_count` INTEGER NOT NULL,
    `cover_color` VARCHAR(10) NULL,
    `cover_type` VARCHAR(10) NULL,
    `description` TEXT NOT NULL,
    `is_done` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event_participants` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `event_id` VARCHAR(191) NOT NULL,
    `participate_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event_notifications` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `event_id` VARCHAR(191) NOT NULL,
    `sent_at` DATETIME(3) NOT NULL,
    `read` BOOLEAN NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chat_rooms` (
    `id` VARCHAR(191) NOT NULL,
    `is_group` BOOLEAN NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `messages` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `room_id` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_chat_rooms` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `room_id` VARCHAR(191) NOT NULL,
    `joined_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `user_chat_rooms_user_id_room_id_key`(`user_id`, `room_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `profiles` ADD CONSTRAINT `profiles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event_activities` ADD CONSTRAINT `event_activities_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `events` ADD CONSTRAINT `events_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `events` ADD CONSTRAINT `events_dress_id_fkey` FOREIGN KEY (`dress_id`) REFERENCES `event_dresses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event_participants` ADD CONSTRAINT `event_participants_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event_participants` ADD CONSTRAINT `event_participants_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event_notifications` ADD CONSTRAINT `event_notifications_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event_notifications` ADD CONSTRAINT `event_notifications_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_room_id_fkey` FOREIGN KEY (`room_id`) REFERENCES `chat_rooms`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_chat_rooms` ADD CONSTRAINT `user_chat_rooms_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_chat_rooms` ADD CONSTRAINT `user_chat_rooms_room_id_fkey` FOREIGN KEY (`room_id`) REFERENCES `chat_rooms`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

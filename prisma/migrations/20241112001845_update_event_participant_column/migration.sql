-- AlterTable
ALTER TABLE `event_participants` ADD COLUMN `accepted` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `participate_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

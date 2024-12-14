-- AlterTable
ALTER TABLE `event_activities` MODIFY `activity_start` DATETIME(3) NOT NULL,
    MODIFY `activity_end` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `events` MODIFY `target_date` DATETIME(3) NOT NULL;

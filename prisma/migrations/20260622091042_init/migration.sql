-- AlterTable
ALTER TABLE `users` ADD COLUMN `password` VARCHAR(191) NULL,
    ADD COLUMN `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE `aws_pangandaran` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `timestamp` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `date` VARCHAR(25) NULL,
    `time` VARCHAR(25) NULL,
    `Batt_V_Avg` FLOAT NULL,
    `PTemp_Max` FLOAT NULL,
    `WS_S_Avg` FLOAT NULL,
    `W_D_Avg` FLOAT NULL,
    `WD_Std` FLOAT NULL,
    `WS_Max` FLOAT NULL,
    `WD_Max_WS` FLOAT NULL,
    `Ta_Avg` FLOAT NULL,
    `Ta_Max` FLOAT NULL,
    `Ta_Min` FLOAT NULL,
    `RH_Avg` FLOAT NULL,
    `RH_Max` FLOAT NULL,
    `RH_Min` FLOAT NULL,
    `e_Avg` FLOAT NULL,
    `e_Max` FLOAT NULL,
    `e_Min` FLOAT NULL,
    `P` FLOAT NULL,
    `NR_Wm2_Avg` FLOAT NULL,
    `NR_Wm2_Max` FLOAT NULL,
    `NR_Wm2_Min` FLOAT NULL,
    `CNR_Wm2_Avg` FLOAT NULL,
    `CNR_Wm2_Max` FLOAT NULL,
    `CNR_Wm2_Min` FLOAT NULL,
    `Rain_mm_Tot` FLOAT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

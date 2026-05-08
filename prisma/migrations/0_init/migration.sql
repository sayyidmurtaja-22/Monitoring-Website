-- CreateTable
CREATE TABLE `aws_bali` (
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

-- CreateTable
CREATE TABLE `aws_bungus` (
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

-- CreateTable
CREATE TABLE `datarecord` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `label` VARCHAR(191) NOT NULL,
    `value` INTEGER NOT NULL,
    `category` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` INTEGER NOT NULL,

    INDEX `DataRecord_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `datarecord` ADD CONSTRAINT `DataRecord_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;


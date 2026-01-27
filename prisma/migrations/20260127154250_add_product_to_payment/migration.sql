/*
  Warnings:

  - Added the required column `currency` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Payment` ADD COLUMN `currency` VARCHAR(191) NOT NULL,
    ADD COLUMN `product` VARCHAR(191) NOT NULL;

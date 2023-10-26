/*
  Warnings:

  - You are about to drop the column `provice` on the `addresses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `addresses` DROP COLUMN `provice`,
    ADD COLUMN `province` VARCHAR(100) NULL;

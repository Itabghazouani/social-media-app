/*
  Warnings:

  - You are about to drop the column `expires_at` on the `email_verification_codes` table. All the data in the column will be lost.
  - You are about to drop the column `expires_at` on the `password_reset_tokens` table. All the data in the column will be lost.
  - Added the required column `expiresAt` to the `email_verification_codes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiresAt` to the `password_reset_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "email_verification_codes" DROP COLUMN "expires_at",
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "password_reset_tokens" DROP COLUMN "expires_at",
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL;

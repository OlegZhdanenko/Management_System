-- AlterTable
ALTER TABLE "user" ADD COLUMN     "verify" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verifyToken" TEXT;

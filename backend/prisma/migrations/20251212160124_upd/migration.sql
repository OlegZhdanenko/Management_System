-- DropForeignKey
ALTER TABLE "groups" DROP CONSTRAINT "groups_createdBy_fkey";

-- AlterTable
ALTER TABLE "groups" ALTER COLUMN "createdBy" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

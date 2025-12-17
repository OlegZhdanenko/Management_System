-- DropForeignKey
ALTER TABLE "notes" DROP CONSTRAINT "notes_createdBy_fkey";

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

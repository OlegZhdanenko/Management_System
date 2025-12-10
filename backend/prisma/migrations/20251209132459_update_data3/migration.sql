-- DropForeignKey
ALTER TABLE "notes" DROP CONSTRAINT "notes_groupId_fkey";

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_id_fkey" FOREIGN KEY ("id") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

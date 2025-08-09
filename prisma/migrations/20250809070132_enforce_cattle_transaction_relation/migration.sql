/*
  Warnings:

  - Made the column `selectedCattle` on table `transactions` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."transactions" DROP CONSTRAINT "transactions_selectedCattle_fkey";

-- AlterTable
ALTER TABLE "public"."transactions" ALTER COLUMN "selectedCattle" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."transactions" ADD CONSTRAINT "transactions_selectedCattle_fkey" FOREIGN KEY ("selectedCattle") REFERENCES "public"."cattle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

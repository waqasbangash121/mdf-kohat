/*
  Warnings:

  - You are about to drop the `Cattle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MilkProduction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Staff` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Transaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."CattleStatus" AS ENUM ('active', 'sold', 'deceased');

-- DropForeignKey
ALTER TABLE "public"."MilkProduction" DROP CONSTRAINT "MilkProduction_cattleId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Transaction" DROP CONSTRAINT "Transaction_cattleId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Transaction" DROP CONSTRAINT "Transaction_milkProductionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Transaction" DROP CONSTRAINT "Transaction_staffId_fkey";

-- DropTable
DROP TABLE "public"."Cattle";

-- DropTable
DROP TABLE "public"."MilkProduction";

-- DropTable
DROP TABLE "public"."Staff";

-- DropTable
DROP TABLE "public"."Transaction";

-- DropEnum
DROP TYPE "public"."ExpenseType";

-- DropEnum
DROP TYPE "public"."IncomeType";

-- DropEnum
DROP TYPE "public"."Session";

-- CreateTable
CREATE TABLE "public"."cattle" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "purchasePrice" INTEGER NOT NULL,
    "purchaseDate" TIMESTAMP(3) NOT NULL,
    "status" "public"."CattleStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cattle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."staff" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cnic" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "salary" INTEGER NOT NULL,
    "dateOfHiring" TIMESTAMP(3) NOT NULL,
    "status" "public"."StaffStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."transactions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."TransactionType" NOT NULL,
    "category" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "details" JSONB,
    "cattleId" TEXT,
    "staffId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "staff_cnic_key" ON "public"."staff"("cnic");

-- AddForeignKey
ALTER TABLE "public"."transactions" ADD CONSTRAINT "transactions_cattleId_fkey" FOREIGN KEY ("cattleId") REFERENCES "public"."cattle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transactions" ADD CONSTRAINT "transactions_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "public"."staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

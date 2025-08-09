/*
  Warnings:

  - You are about to drop the `cattle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `health_records` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `milk_production` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `staff` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `transactions` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."TransactionType" AS ENUM ('income', 'expense');

-- CreateEnum
CREATE TYPE "public"."IncomeType" AS ENUM ('SellCattle', 'SellMilk', 'Other');

-- CreateEnum
CREATE TYPE "public"."ExpenseType" AS ENUM ('BuyCattle', 'CattleFood', 'StaffSalary', 'FuelExpense', 'OtherExpense');

-- CreateEnum
CREATE TYPE "public"."Session" AS ENUM ('morning', 'evening');

-- CreateEnum
CREATE TYPE "public"."StaffStatus" AS ENUM ('active', 'terminated');

-- DropForeignKey
ALTER TABLE "public"."health_records" DROP CONSTRAINT "health_records_cattleId_fkey";

-- DropForeignKey
ALTER TABLE "public"."milk_production" DROP CONSTRAINT "milk_production_cattleId_fkey";

-- DropForeignKey
ALTER TABLE "public"."transactions" DROP CONSTRAINT "transactions_selectedCattle_fkey";

-- DropForeignKey
ALTER TABLE "public"."transactions" DROP CONSTRAINT "transactions_selectedStaff_fkey";

-- DropTable
DROP TABLE "public"."cattle";

-- DropTable
DROP TABLE "public"."health_records";

-- DropTable
DROP TABLE "public"."milk_production";

-- DropTable
DROP TABLE "public"."staff";

-- DropTable
DROP TABLE "public"."transactions";

-- CreateTable
CREATE TABLE "public"."Cattle" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cattle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MilkProduction" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "session" "public"."Session" NOT NULL,
    "litres" INTEGER NOT NULL,
    "pricePerLitre" INTEGER NOT NULL,
    "cattleId" TEXT,

    CONSTRAINT "MilkProduction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Transaction" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."TransactionType" NOT NULL,
    "incomeType" "public"."IncomeType",
    "expenseType" "public"."ExpenseType",
    "amount" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "cattleId" TEXT,
    "milkProductionId" TEXT,
    "staffId" TEXT,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Staff" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cnic" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "salary" INTEGER NOT NULL,
    "dateOfHiring" TIMESTAMP(3) NOT NULL,
    "status" "public"."StaffStatus" NOT NULL,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."MilkProduction" ADD CONSTRAINT "MilkProduction_cattleId_fkey" FOREIGN KEY ("cattleId") REFERENCES "public"."Cattle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_cattleId_fkey" FOREIGN KEY ("cattleId") REFERENCES "public"."Cattle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_milkProductionId_fkey" FOREIGN KEY ("milkProductionId") REFERENCES "public"."MilkProduction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "public"."Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

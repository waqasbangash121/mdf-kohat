-- CreateTable
CREATE TABLE "public"."cattle" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "dateAdded" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'active',

    CONSTRAINT "cattle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."transactions" (
    "id" TEXT NOT NULL,
    "transactionName" TEXT NOT NULL,
    "transactionType" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "selectedCattle" TEXT,
    "cattleType" TEXT,
    "cattleAge" INTEGER,
    "selectedStaff" TEXT,
    "litres" INTEGER,
    "pricePerLitre" INTEGER,
    "session" TEXT,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."staff" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "salary" INTEGER,

    CONSTRAINT "staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."milk_production" (
    "id" TEXT NOT NULL,
    "cattleId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "session" TEXT NOT NULL,
    "litres" INTEGER NOT NULL,
    "pricePerLitre" INTEGER NOT NULL,

    CONSTRAINT "milk_production_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."health_records" (
    "id" TEXT NOT NULL,
    "cattleId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "veterinarian" TEXT,
    "status" TEXT NOT NULL DEFAULT 'scheduled',

    CONSTRAINT "health_records_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."transactions" ADD CONSTRAINT "transactions_selectedCattle_fkey" FOREIGN KEY ("selectedCattle") REFERENCES "public"."cattle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transactions" ADD CONSTRAINT "transactions_selectedStaff_fkey" FOREIGN KEY ("selectedStaff") REFERENCES "public"."staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."milk_production" ADD CONSTRAINT "milk_production_cattleId_fkey" FOREIGN KEY ("cattleId") REFERENCES "public"."cattle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."health_records" ADD CONSTRAINT "health_records_cattleId_fkey" FOREIGN KEY ("cattleId") REFERENCES "public"."cattle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

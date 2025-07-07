-- CreateTable
CREATE TABLE "things" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "expireAt" TIMESTAMP(3) NOT NULL,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "recurringInterval" INTEGER,
    "notifyAt" INTEGER NOT NULL,
    "isConsumable" BOOLEAN NOT NULL DEFAULT false,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "things_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consumption_records" (
    "id" TEXT NOT NULL,
    "thingId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "consumption_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TagToThing" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_TagToThing_AB_unique" ON "_TagToThing"("A", "B");

-- CreateIndex
CREATE INDEX "_TagToThing_B_index" ON "_TagToThing"("B");

-- AddForeignKey
ALTER TABLE "consumption_records" ADD CONSTRAINT "consumption_records_thingId_fkey" FOREIGN KEY ("thingId") REFERENCES "things"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TagToThing" ADD CONSTRAINT "_TagToThing_A_fkey" FOREIGN KEY ("A") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TagToThing" ADD CONSTRAINT "_TagToThing_B_fkey" FOREIGN KEY ("B") REFERENCES "things"("id") ON DELETE CASCADE ON UPDATE CASCADE;

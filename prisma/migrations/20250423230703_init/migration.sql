-- CreateTable
CREATE TABLE "CommetCRM" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" REAL NOT NULL,
    "salesperson" TEXT NOT NULL,
    "date" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "CommetCRM_id_key" ON "CommetCRM"("id");

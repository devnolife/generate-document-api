/*
  Warnings:

  - A unique constraint covering the columns `[type,prodi]` on the table `documents` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "documents_type_key";

-- CreateIndex
CREATE UNIQUE INDEX "documents_type_prodi_key" ON "documents"("type", "prodi");

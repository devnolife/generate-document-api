-- CreateTable
CREATE TABLE "documents" (
    "id" SERIAL NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "prodi" VARCHAR(100),
    "template_path" VARCHAR(255),
    "description" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_fields" (
    "id" SERIAL NOT NULL,
    "document_id" INTEGER,
    "field_name" VARCHAR(255) NOT NULL,
    "field_type" VARCHAR(50) NOT NULL,
    "is_required" BOOLEAN DEFAULT true,
    "default_value" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_fields_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "documents_type_key" ON "documents"("type");

-- AddForeignKey
ALTER TABLE "document_fields" ADD CONSTRAINT "document_fields_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

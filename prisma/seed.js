const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Hapus semua data lama
  await prisma.document_fields.deleteMany();
  await prisma.documents.deleteMany();

  // Data untuk setiap prodi
  const prodiTemplates = [
    {
      type: 'kkp',
      prodi: 'informatika',
      template_path: 'templates/informatika/kkp.docx',
      description: 'Surat Kerja Kuliah Praktik - Teknik Informatika',
      fields: [
        { field_name: 'kepada', field_type: 'text', is_required: true },
        { field_name: 'tempat_tujuan', field_type: 'text', is_required: true },
        { field_name: 'nama_prodi', field_type: 'text', is_required: true, default_value: 'Teknik Informatika' },
        { field_name: 'tanggal_hijriyah', field_type: 'date', is_required: true },
        { field_name: 'tanggal_masehi', field_type: 'date', is_required: true },
        { field_name: 'tableData', field_type: 'array', is_required: true }
      ]
    },
    {
      type: 'kkp',
      prodi: 'pengairan',
      template_path: 'templates/pengairan/kkp.docx',
      description: 'Surat Kerja Kuliah Praktik - Teknik Pengairan',
      fields: [
        { field_name: 'kepada', field_type: 'text', is_required: true },
        { field_name: 'tempat_tujuan', field_type: 'text', is_required: true },
        { field_name: 'nama_prodi', field_type: 'text', is_required: true, default_value: 'Teknik Pengairan' },
        { field_name: 'tanggal_hijriyah', field_type: 'date', is_required: true },
        { field_name: 'tanggal_masehi', field_type: 'date', is_required: true },
        { field_name: 'tableData', field_type: 'array', is_required: true },
        { field_name: 'dosen_pembimbing', field_type: 'text', is_required: false }
      ]
    },
    {
      type: 'kkp',
      prodi: 'elektro',
      template_path: 'templates/elektro/kkp.docx',
      description: 'Surat Kerja Kuliah Praktik - Teknik Elektro',
      fields: [
        { field_name: 'kepada', field_type: 'text', is_required: true },
        { field_name: 'tempat_tujuan', field_type: 'text', is_required: true },
        { field_name: 'nama_prodi', field_type: 'text', is_required: true, default_value: 'Teknik Elektro' },
        { field_name: 'tanggal_hijriyah', field_type: 'date', is_required: true },
        { field_name: 'tanggal_masehi', field_type: 'date', is_required: true },
        { field_name: 'tableData', field_type: 'array', is_required: true },
        { field_name: 'bidang_keahlian', field_type: 'text', is_required: false }
      ]
    },
    {
      type: 'kkp',
      prodi: 'arsitektur',
      template_path: 'templates/arsitektur/kkp.docx',
      description: 'Surat Kerja Kuliah Praktik - Arsitektur',
      fields: [
        { field_name: 'kepada', field_type: 'text', is_required: true },
        { field_name: 'tempat_tujuan', field_type: 'text', is_required: true },
        { field_name: 'nama_prodi', field_type: 'text', is_required: true, default_value: 'Arsitektur' },
        { field_name: 'tanggal_hijriyah', field_type: 'date', is_required: true },
        { field_name: 'tanggal_masehi', field_type: 'date', is_required: true },
        { field_name: 'tableData', field_type: 'array', is_required: true },
        { field_name: 'jenis_proyek', field_type: 'text', is_required: false }
      ]
    },
    {
      type: 'kkp',
      prodi: 'pwk',
      template_path: 'templates/pwk/kkp.docx',
      description: 'Surat Kerja Kuliah Praktik - Perencanaan Wilayah dan Kota',
      fields: [
        { field_name: 'kepada', field_type: 'text', is_required: true },
        { field_name: 'tempat_tujuan', field_type: 'text', is_required: true },
        { field_name: 'nama_prodi', field_type: 'text', is_required: true, default_value: 'Perencanaan Wilayah dan Kota' },
        { field_name: 'tanggal_hijriyah', field_type: 'date', is_required: true },
        { field_name: 'tanggal_masehi', field_type: 'date', is_required: true },
        { field_name: 'tableData', field_type: 'array', is_required: true },
        { field_name: 'wilayah_fokus', field_type: 'text', is_required: false }
      ]
    }
  ];

  // Insert data untuk setiap prodi
  for (const template of prodiTemplates) {
    const document = await prisma.documents.create({
      data: {
        type: template.type,
        prodi: template.prodi,
        template_path: template.template_path,
        description: template.description,
        document_fields: {
          create: template.fields.map(field => ({
            field_name: field.field_name,
            field_type: field.field_type,
            is_required: field.is_required,
            default_value: field.default_value || null
          }))
        }
      }
    });

    console.log(`Created document template for ${template.prodi}:`, document.id);
  }

  console.log('✅ Seed data berhasil ditambahkan untuk semua prodi!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

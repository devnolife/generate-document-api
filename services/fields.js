const prisma = require('../prisma');
const { setDate } = require('../utils/generate-date');

const generateFieldData = async (type, prodi, data) => {
  try {
    // Cari dokumen berdasarkan type dan prodi
    const document = await prisma.documents.findFirst({
      where: {
        type: type,
        prodi: prodi
      },
      include: { document_fields: true },
    });

    if (!document) {
      throw new Error(`Dokumen dengan tipe "${type}" untuk prodi "${prodi}" tidak ditemukan.`);
    }

    const fields = document.document_fields;

    const documentData = fields.reduce((acc, field) => {
      const value = data[field.field_name];

      // Handle table data (array mahasiswa)
      if (field.field_name === 'tableData' && Array.isArray(value)) {
        acc[field.field_name] = value.map((item, index) => ({
          no: index + 1,
          ...item,
        }));
      }
      // Handle tanggal
      else if (field.field_name === 'tanggal_hijriyah' || field.field_name === 'tanggal_masehi') {
        const { tanggalHijriah, tanggalMasehi } = setDate(data.tanggal_hijriyah, data.tanggal_masehi);
        acc['tanggal_hijriyah'] = tanggalHijriah;
        acc['tanggal_masehi'] = tanggalMasehi;
      }
      // Handle field biasa
      else {
        // Gunakan default value jika tidak ada input dan field memiliki default
        acc[field.field_name] = value || field.default_value || null;
      }
      return acc;
    }, {});

    // Tambahkan metadata dokumen
    documentData._metadata = {
      template_path: document.template_path,
      prodi: document.prodi,
      type: document.type,
      description: document.description
    };

    return documentData;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = generateFieldData;

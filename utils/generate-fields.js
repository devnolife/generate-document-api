const { setDate } = require('./generate-date');
const prisma = require('../prisma');

const generateFields = async (type, prodi, body) => {
  try {
    // Cari dokumen berdasarkan type dan prodi dari database
    const document = await prisma.documents.findFirst({
      where: {
        type: type,
        prodi: prodi
      },
      include: { document_fields: true },
    });

    if (!document) {
      throw new Error(`Dokumen dengan tipe "${type}" untuk prodi "${prodi}" tidak ditemukan di database.`);
    }

    const fields = document.document_fields;
    const result = {};

    // Process setiap field berdasarkan konfigurasi database
    for (const field of fields) {
      const fieldName = field.field_name;
      const fieldType = field.field_type;
      const inputValue = body[fieldName];

      switch (fieldType) {
        case 'string':
        case 'text':
          result[fieldName] = inputValue || field.default_value || '';
          break;

        case 'date_hijriyah':
          result[fieldName] = inputValue ? setDate(inputValue) : setDate(new Date().toISOString());
          break;

        case 'date_masehi':
          result[fieldName] = inputValue ? inputValue : new Date().toISOString();
          break;

        case 'table':
        case 'array':
          if (Array.isArray(inputValue)) {
            result[fieldName] = inputValue.map((data, index) => ({
              no: index + 1,
              ...data
            }));
          } else {
            result[fieldName] = [];
          }
          break;

        case 'number':
          result[fieldName] = inputValue ? Number(inputValue) : (field.default_value ? Number(field.default_value) : 0);
          break;

        case 'boolean':
          result[fieldName] = inputValue !== undefined ? Boolean(inputValue) : (field.default_value === 'true');
          break;

        default:
          result[fieldName] = inputValue || field.default_value || null;
          break;
      }
    }

    // Tambahkan metadata dokumen
    result._metadata = {
      template_path: document.template_path,
      prodi: document.prodi,
      type: document.type,
      description: document.description
    };

    return result;
  } catch (error) {
    throw new Error(`Error generating fields: ${error.message}`);
  }
};

// Function untuk mendapatkan daftar field yang tersedia untuk tipe dokumen
const getAvailableFields = async (type, prodi = null) => {
  try {
    let whereClause = { type: type };

    if (prodi) {
      whereClause.prodi = prodi;
    }

    const documents = await prisma.documents.findMany({
      where: whereClause,
      include: { document_fields: true },
    }); if (documents.length === 0) {
      throw new Error(`Tidak ada dokumen dengan tipe "${type}"${prodi ? ` untuk prodi "${prodi}"` : ''} ditemukan.`);
    }

    return documents.map(doc => ({
      id: doc.id,
      type: doc.type,
      prodi: doc.prodi,
      template_path: doc.template_path,
      description: doc.description,
      fields: doc.document_fields.map(field => ({
        field_name: field.field_name,
        field_type: field.field_type,
        is_required: field.is_required,
        default_value: field.default_value
      }))
    }));
  } catch (error) {
    throw new Error(`Error getting available fields: ${error.message}`);
  }
};

// Function untuk mendapatkan semua tipe dokumen yang tersedia
const getAllDocumentTypes = async () => {
  try {
    const documents = await prisma.documents.findMany({
      select: {
        type: true,
        prodi: true,
        description: true,
        template_path: true
      },
      orderBy: [
        { type: 'asc' },
        { prodi: 'asc' }
      ]
    });

    // Group by type
    const groupedTypes = documents.reduce((acc, doc) => {
      if (!acc[doc.type]) {
        acc[doc.type] = [];
      }
      acc[doc.type].push({
        prodi: doc.prodi,
        description: doc.description,
        template_path: doc.template_path
      });
      return acc;
    }, {});

    return groupedTypes;
  } catch (error) {
    throw new Error(`Error getting document types: ${error.message}`);
  }
};

module.exports = {
  generateFields,
  getAvailableFields,
  getAllDocumentTypes,
};

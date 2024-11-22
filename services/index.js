const generateDocument = require('../utils/generate-document');
const generateFieldData = require('./fields');

const serviceDocument = async ({ type, data, prodi }) => {
  try {
    const documentData = await generateFieldData(type, data);
    if (!documentData || Object.keys(documentData).length === 0) {
      throw new Error(`Field untuk dokumen dengan tipe "${type}" tidak ditemukan.`);
    }
    return await generateDocument(type, documentData, prodi);
  } catch (error) {
    throw new Error(
      `Terjadi kesalahan dalam proses pembuatan dokumen ${type.toUpperCase()}: ${error.message}`
    );
  }
};

module.exports = {
  serviceDocument,
};

const generateDocument = require('../utils/generate-document');
const generateFieldData = require('./fields');

const serviceDocument = async ({ type, prodi, data }) => {
  try {
    // Validasi parameter wajib
    if (!type) {
      throw new Error('Parameter "type" dokumen wajib disediakan');
    }
    if (!prodi) {
      throw new Error('Parameter "prodi" wajib disediakan');
    }

    const documentData = await generateFieldData(type, prodi, data);
    if (!documentData || Object.keys(documentData).length === 0) {
      throw new Error(`Field untuk dokumen dengan tipe "${type}" prodi "${prodi}" tidak ditemukan.`);
    }

    // Generate dokumen dengan template sesuai prodi
    const { filePath, no_surat } = await generateDocument(type, prodi, documentData);

    return {
      filePath,
      no_surat,
      prodi,
      message: `Dokumen ${type.toUpperCase()} untuk prodi ${prodi} berhasil dibuat`
    };
  } catch (error) {
    throw new Error(`Terjadi kesalahan dalam proses pembuatan dokumen ${type.toUpperCase()} prodi ${prodi}: ${error.message}`);
  }
};

module.exports = {
  serviceDocument,
};

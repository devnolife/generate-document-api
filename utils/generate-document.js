const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const { v4: uuidv4 } = require('uuid'); // Import UUID v4
const { lastNumber, uploadFileToApi } = require('../api'); // Hanya import lastNumber
const { generateQRCodeWithImage } = require('./generate-qrcode');
const ImageModule = require('docxtemplater-image-module-free');

const generateDocument = async (type, data, prodi) => {
  try {
    const no_surat = await lastNumber(type);
    const templatePath = path.resolve(__dirname, `../templates/${type}/${prodi}.docx`);
    const templateContent = fs.readFileSync(templatePath, 'binary');
    const zip = new PizZip(templateContent);
    const uuid = uuidv4();
    const qrCodePath = await generateQRCodeWithImage(`https://storage.superapps.if.unismuh.ac.id/${uuid}`);
    const imageModuleOpts = {
      centered: true,
      fileType: 'docx',
      getImage: (tagValue) => {
        if (tagValue === 'qrCode') {
          return fs.readFileSync(qrCodePath);
        }
        throw new Error(`Tag ${tagValue} tidak dikenal`);
      },
      getSize: () => {
        return [120, 120];
      },
    };

    const imageModule = new ImageModule(imageModuleOpts);
    const doc = new Docxtemplater()
      .attachModule(imageModule)
      .loadZip(zip);

    doc.setData({
      ...data,
      no_surat,
      qrCode: 'qrCode',
    });

    doc.render();

    const buffer = doc.getZip().generate({ type: 'nodebuffer' });

    if (qrCodePath && fs.existsSync(qrCodePath)) {
      fs.unlinkSync(qrCodePath);
    }

    const uploadResult = await uploadFileToApi(buffer, uuid);

    if (!uploadResult || !uploadResult?.fileId) {
      throw new Error('Gagal mengunggah dokumen ke API.');
    }
    return {
      id_document: uploadResult?.fileId,
      no_surat,
      link_document: `https://storage.superapps.if.unismuh.ac.id/${uuid}`,
      message: 'Dokumen berhasil dibuat dan diunggah.',
    };
  } catch (error) {
    throw new Error(`Gagal membuat dokumen: ${error.message}`);
  }
};

module.exports = generateDocument;

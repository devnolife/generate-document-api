const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const { lastNumber } = require('../api');
const { generateQRCodeWithImage } = require('./generate-qrcode');
const ImageModule = require('docxtemplater-image-module-free');

const generateDocument = async (type, data) => {
  try {
    const no_surat = await lastNumber(type);
    const templatePath = path.resolve(__dirname, `../templates/${type}.docx`);
    const templateContent = fs.readFileSync(templatePath, 'binary');
    const zip = new PizZip(templateContent);

    const qrCodePath = await generateQRCodeWithImage(
      `${no_surat},${data.nama_ttd || 'Unknown'}`
    );

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
        return [100, 100];
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

    const outputDir = path.resolve(__dirname, '../templates/output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    const time = new Date().getTime();
    const outputPath = path.join(outputDir, `${time}.docx`);
    const buffer = doc.getZip().generate({ type: 'nodebuffer' });
    fs.writeFileSync(outputPath, buffer);

    return { filePath: outputPath, no_surat: no_surat };
  } catch (error) {
    console.error('Error generating document:', error);
    throw new Error('Gagal membuat dokumen');
  }
};

module.exports = generateDocument;


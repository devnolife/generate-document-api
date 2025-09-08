const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const { lastNumber } = require('../api');
const { generateQRCodeWithImage } = require('./generate-qrcode');
const ImageModule = require('docxtemplater-image-module-free');

const generateDocument = async (type, prodi, data) => {
  try {
    const no_surat = await lastNumber(type);

    // Gunakan template path dari metadata jika ada, fallback ke path lama
    const templatePath = data._metadata?.template_path
      ? path.resolve(__dirname, '..', data._metadata.template_path)
      : path.resolve(__dirname, `../templates/${prodi}/${type}.docx`);

    // Cek apakah template file ada
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template file tidak ditemukan: ${templatePath}`);
    }

    const templateContent = fs.readFileSync(templatePath, 'binary');
    const zip = new PizZip(templateContent);

    const qrCodePath = await generateQRCodeWithImage(
      `${no_surat},${data.nama_ttd || 'Unknown'},${prodi}`
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

    // Hapus metadata sebelum render
    const { _metadata, ...renderData } = data;

    doc.setData({
      ...renderData,
      no_surat,
      prodi: prodi,
      qrCode: 'qrCode',
    });

    doc.render();

    const outputDir = path.resolve(__dirname, '../templates/output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    const time = new Date().getTime();
    const outputPath = path.join(outputDir, `${prodi}_${type}_${time}.docx`);
    const buffer = doc.getZip().generate({ type: 'nodebuffer' });
    fs.writeFileSync(outputPath, buffer);

    return { filePath: outputPath, no_surat: no_surat };
  } catch (error) {
    console.error('Error generating document:', error);
    throw new Error(`Gagal membuat dokumen: ${error.message}`);
  }
};

module.exports = generateDocument;


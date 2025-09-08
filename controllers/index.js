const { serviceDocument } = require('../services');

const generateDocument = async (req, res) => {
  try {
    const { type, prodi } = req.params;
    const data = req.body;

    // Validasi parameter
    if (!type) {
      return res.status(400).json({
        success: false,
        message: 'Parameter "type" dokumen wajib disediakan'
      });
    }
    if (!prodi) {
      return res.status(400).json({
        success: false,
        message: 'Parameter "prodi" wajib disediakan'
      });
    }

    const result = await serviceDocument({ type, prodi, data });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error generating document:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error'
    });
  }
};

// Endpoint untuk mendapatkan daftar prodi yang tersedia
const getAvailableProdi = async (req, res) => {
  try {
    const { type } = req.params;
    const prisma = require('../prisma');

    const documents = await prisma.documents.findMany({
      where: type ? { type } : {},
      select: {
        type: true,
        prodi: true,
        description: true,
        template_path: true
      }
    });

    res.json({
      success: true,
      data: documents
    });
  } catch (error) {
    console.error('Error fetching prodi list:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch prodi list'
    });
  }
};

// Endpoint untuk mendapatkan field yang diperlukan berdasarkan type dan prodi
const getRequiredFields = async (req, res) => {
  try {
    const { type, prodi } = req.params;
    const prisma = require('../prisma');

    const document = await prisma.documents.findFirst({
      where: {
        type: type,
        prodi: prodi
      },
      include: {
        document_fields: {
          orderBy: {
            field_name: 'asc'
          }
        }
      }
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: `Template untuk ${type} prodi ${prodi} tidak ditemukan`
      });
    }

    res.json({
      success: true,
      data: {
        type: document.type,
        prodi: document.prodi,
        description: document.description,
        fields: document.document_fields
      }
    });
  } catch (error) {
    console.error('Error fetching required fields:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch required fields'
    });
  }
};

module.exports = {
  generateDocument,
  getAvailableProdi,
  getRequiredFields,
};

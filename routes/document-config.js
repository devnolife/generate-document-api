const express = require('express');
const router = express.Router();
const { generateFields, getAvailableFields, getAllDocumentTypes } = require('../utils/generate-fields');

// Get all available document types
router.get('/types', async (req, res) => {
  try {
    const types = await getAllDocumentTypes();
    res.json({
      success: true,
      data: types,
      message: 'Document types retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get available fields for specific document type
router.get('/fields/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const { prodi } = req.query;

    const fields = await getAvailableFields(type, prodi);
    res.json({
      success: true,
      data: fields,
      message: 'Available fields retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Generate fields for document (testing endpoint)
router.post('/generate/:type/:prodi', async (req, res) => {
  try {
    const { type, prodi } = req.params;
    const body = req.body;

    const generatedFields = await generateFields(type, prodi, body);
    res.json({
      success: true,
      data: generatedFields,
      message: 'Fields generated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;

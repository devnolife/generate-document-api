
const express = require('express');
const router = express.Router();
const { generateDocument, getAvailableProdi, getRequiredFields } = require('../controllers');

// Import document config routes
// const documentConfigRoutes = require('./document-config');

// Document config routes
// router.use('/document-config', documentConfigRoutes);

// Generate document dengan prodi dinamis
router.post('/generate-document/:type/:prodi', generateDocument);

// Mendapatkan daftar prodi yang tersedia
router.get('/templates', getAvailableProdi);
router.get('/templates/:type', getAvailableProdi);

// Mendapatkan field yang diperlukan untuk template tertentu
router.get('/templates/:type/:prodi/fields', getRequiredFields);

// Backward compatibility - redirect ke endpoint lama (default ke informatika)
router.post('/generate-document/:type', (req, res, next) => {
  req.params.prodi = 'informatika'; // default prodi
  generateDocument(req, res, next);
});

module.exports = router;

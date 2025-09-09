const express = require('express');
const router = express.Router();
const { getAllDocumentTypes, getAvailableFields } = require('../utils/generate-fields');
const prisma = require('../prisma');

// Home page
router.get('/', async (req, res) => {
  try {
    const documentTypes = await getAllDocumentTypes();
    res.render('index', {
      title: 'Generate Document API - Dynamic Multi-Prodi',
      documentTypes,
      currentPage: 'home'
    });
  } catch (error) {
    console.error('Error loading home page:', error);
    res.render('error', {
      title: 'Error',
      message: 'Unable to load document types',
      status: 500,
      stack: error.stack
    });
  }
});

// Template explorer page
router.get('/templates', async (req, res) => {
  try {
    const documents = await prisma.documents.findMany({
      include: { document_fields: true },
      orderBy: [
        { type: 'asc' },
        { prodi: 'asc' }
      ]
    });

    res.render('templates', {
      title: 'Template Explorer',
      documents,
      currentPage: 'templates'
    });
  } catch (error) {
    console.error('Error loading templates:', error);
    res.render('error', {
      title: 'Error',
      message: 'Unable to load templates',
      status: 500,
      stack: error.stack
    });
  }
});

// Template detail page
router.get('/templates/:type/:prodi', async (req, res) => {
  try {
    const { type, prodi } = req.params;
    const document = await prisma.documents.findFirst({
      where: { type, prodi },
      include: { document_fields: true }
    });

    if (!document) {
      return res.status(404).render('error', {
        title: 'Template Not Found',
        message: `Template ${type} untuk prodi ${prodi} tidak ditemukan`,
        status: 404,
        stack: null
      });
    }

    res.render('template-detail', {
      title: `Template ${type.toUpperCase()} - ${prodi}`,
      document,
      currentPage: 'templates'
    });
  } catch (error) {
    console.error('Error loading template detail:', error);
    res.render('error', {
      title: 'Error',
      message: 'Unable to load template details',
      status: 500,
      stack: error.stack
    });
  }
});

// Generate document page
router.get('/generate/:type/:prodi', async (req, res) => {
  try {
    const { type, prodi } = req.params;
    const document = await prisma.documents.findFirst({
      where: { type, prodi },
      include: { document_fields: true }
    });

    if (!document) {
      return res.status(404).render('error', {
        title: 'Template Not Found',
        message: `Template ${type} untuk prodi ${prodi} tidak ditemukan`,
        status: 404,
        stack: null
      });
    }

    res.render('generate', {
      title: `Generate ${type.toUpperCase()} - ${prodi}`,
      document,
      currentPage: 'generate'
    });
  } catch (error) {
    console.error('Error loading generate page:', error);
    res.render('error', {
      title: 'Error',
      message: 'Unable to load generate form',
      status: 500,
      stack: error.stack
    });
  }
});

// API Documentation page
router.get('/docs', async (req, res) => {
  try {
    const documentTypes = await getAllDocumentTypes();

    // Convert to array format for template compatibility
    const documentTypesArray = Object.entries(documentTypes).map(([key, value]) => ({
      type: key.split('_')[0],
      prodi: key.split('_')[1],
      fieldsCount: value.document_fields ? value.document_fields.length : 0
    }));

    res.render('docs', {
      title: 'API Documentation',
      documentTypes: documentTypesArray,
      currentPage: 'docs'
    });
  } catch (error) {
    console.error('Error loading docs page:', error);
    res.render('error', {
      title: 'Error',
      message: 'Unable to load documentation',
      status: 500,
      stack: error.stack
    });
  }
});

// Error handling for 404
router.use((req, res) => {
  res.status(404).render('error', {
    title: 'Page Not Found',
    message: 'The page you are looking for does not exist.',
    status: 404,
    stack: null
  });
});

module.exports = router;

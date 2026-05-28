const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');
const {
  uploadDocument,
  getUserUploads,
  deleteUpload,
} = require('../controllers/uploadController');

const router = express.Router();

router.post('/', authMiddleware, uploadMiddleware, uploadDocument);
router.get('/', authMiddleware, getUserUploads);
router.delete('/:id', authMiddleware, deleteUpload);

module.exports = router;

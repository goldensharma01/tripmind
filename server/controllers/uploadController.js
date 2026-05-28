const fs = require('fs').promises;
const Upload = require('../models/Upload');
const { extractFromDocument } = require('../services/aiService');

const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const upload = await Upload.create({
      user: req.user.id,
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      path: req.file.path,
      size: req.file.size,
      status: 'processing',
    });

    try {
      const extractedData = await extractFromDocument(req.file.path, req.file.mimetype);
      upload.extractedData = extractedData;
      upload.status = 'done';
      await upload.save();

      res.status(201).json(upload);
    } catch (extractError) {
      upload.status = 'failed';
      await upload.save();
      res.status(500).json({
        message: extractError.message || 'Failed to extract document data',
        upload,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || 'Upload failed' });
  }
};

const getUserUploads = async (req, res) => {
  try {
    const uploads = await Upload.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(uploads);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch uploads' });
  }
};

const deleteUpload = async (req, res) => {
  try {
    const upload = await Upload.findOne({ _id: req.params.id, user: req.user.id });

    if (!upload) {
      return res.status(404).json({ message: 'Upload not found' });
    }

    try {
      await fs.unlink(upload.path);
    } catch {
      // File may already be removed from disk
    }

    await upload.deleteOne();
    res.json({ message: 'Upload deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to delete upload' });
  }
};

module.exports = {
  uploadDocument,
  getUserUploads,
  deleteUpload,
};

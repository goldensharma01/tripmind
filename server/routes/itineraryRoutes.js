const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  generateItinerary,
  getUserItineraries,
  getItineraryById,
  getSharedItinerary,
  deleteItinerary,
} = require('../controllers/itineraryController');

const router = express.Router();

router.get('/share/:shareId', getSharedItinerary);
router.post('/generate', authMiddleware, generateItinerary);
router.get('/', authMiddleware, getUserItineraries);
router.get('/:id', authMiddleware, getItineraryById);
router.delete('/:id', authMiddleware, deleteItinerary);

module.exports = router;

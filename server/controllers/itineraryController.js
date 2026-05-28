const { v4: uuidv4 } = require('uuid');
const Upload = require('../models/Upload');
const Itinerary = require('../models/Itinerary');
const { generateItinerary: generateItineraryAI } = require('../services/aiService');

const generateItinerary = async (req, res) => {
  try {
    const { uploadIds, destination, days } = req.body;

    if (!uploadIds || !Array.isArray(uploadIds) || uploadIds.length === 0) {
      return res.status(400).json({ message: 'Please provide at least one upload ID' });
    }

    if (!destination || !days) {
      return res.status(400).json({ message: 'Please provide destination and number of days' });
    }

    const uploads = await Upload.find({
      _id: { $in: uploadIds },
      user: req.user.id,
      status: 'done',
    });

    if (uploads.length === 0) {
      return res.status(400).json({ message: 'No valid processed uploads found' });
    }

    const extractedDataArray = uploads.map((u) => u.extractedData).filter(Boolean);
    const aiResult = await generateItineraryAI(
      extractedDataArray,
      destination,
      Number(days)
    );

    const startDate = aiResult.startDate ? new Date(aiResult.startDate) : new Date();
    const endDate = aiResult.endDate
      ? new Date(aiResult.endDate)
      : new Date(startDate.getTime() + (Number(days) - 1) * 24 * 60 * 60 * 1000);

    const itinerary = await Itinerary.create({
      user: req.user.id,
      title: aiResult.title || `${destination} Trip`,
      destination: aiResult.destination || destination,
      startDate,
      endDate,
      days: aiResult.days || [],
      uploads: uploads.map((u) => u._id),
      shareId: uuidv4(),
      isShared: false,
    });

    res.status(201).json(itinerary);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to generate itinerary' });
  }
};

const getUserItineraries = async (req, res) => {
  try {
    const itineraries = await Itinerary.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('uploads');
    res.json(itineraries);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch itineraries' });
  }
};

const getItineraryById = async (req, res) => {
  try {
    const itinerary = await Itinerary.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).populate('uploads');

    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }

    res.json(itinerary);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch itinerary' });
  }
};

const getSharedItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.findOne({ shareId: req.params.shareId }).populate('uploads');

    if (!itinerary) {
      return res.status(404).json({ message: 'Shared itinerary not found' });
    }

    res.json(itinerary);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch shared itinerary' });
  }
};

const deleteItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }

    await itinerary.deleteOne();
    res.json({ message: 'Itinerary deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to delete itinerary' });
  }
};

module.exports = {
  generateItinerary,
  getUserItineraries,
  getItineraryById,
  getSharedItinerary,
  deleteItinerary,
};

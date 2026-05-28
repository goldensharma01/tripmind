const mongoose = require('mongoose');

const daySchema = new mongoose.Schema(
  {
    dayNumber: { type: Number, required: true },
    title: { type: String, required: true },
    activities: [{ type: String }],
  },
  { _id: false }
);

const itinerarySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    destination: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    days: [daySchema],
    uploads: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Upload',
      },
    ],
    shareId: {
      type: String,
      unique: true,
      required: true,
    },
    isShared: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Itinerary', itinerarySchema);

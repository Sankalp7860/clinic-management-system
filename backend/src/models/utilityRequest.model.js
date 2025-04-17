const mongoose = require('mongoose');

const UtilityRequestSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    itemName: {
      type: String,
      required: [true, 'Please add the item name']
    },
    itemType: {
      type: String,
      required: [true, 'Please specify the item type'],
      enum: ['Equipment', 'Medicine', 'Consumable', 'Device', 'Other']
    },
    quantity: {
      type: Number,
      required: [true, 'Please specify the quantity needed']
    },
    urgency: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium'
    },
    reason: {
      type: String,
      required: [true, 'Please provide a reason for the request']
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    adminNotes: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('UtilityRequest', UtilityRequestSchema);
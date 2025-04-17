const mongoose = require('mongoose');

const MedicalRecordSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment'
    },
    diagnosis: {
      type: String,
      required: [true, 'Please add a diagnosis']
    },
    prescription: [{
      medication: {
        type: String,
        required: true
      },
      dosage: {
        type: String,
        required: true
      },
      frequency: {
        type: String,
        required: true
      },
      duration: {
        type: String,
        required: true
      }
    }],
    notes: {
      type: String
    },
    attachments: [{
      name: String,
      url: String,
      type: String
    }]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('MedicalRecord', MedicalRecordSchema);
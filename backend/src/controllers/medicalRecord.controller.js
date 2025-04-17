const MedicalRecord = require('../models/medicalRecord.model');

// @desc    Create new medical record
// @route   POST /api/medical-records
// @access  Private/Doctor
exports.createMedicalRecord = async (req, res) => {
  try {
    // Set doctor to logged in user if doctor
    if (req.user.role === 'doctor') {
      req.body.doctor = req.user.id;
    }

    const medicalRecord = await MedicalRecord.create(req.body);

    res.status(201).json({
      success: true,
      data: medicalRecord
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all medical records
// @route   GET /api/medical-records
// @access  Private
exports.getMedicalRecords = async (req, res) => {
  try {
    let query;

    // If user is patient, only show their records
    if (req.user.role === 'patient') {
      query = MedicalRecord.find({ patient: req.user.id });
    } 
    // If user is doctor, only show records they created
    else if (req.user.role === 'doctor') {
      query = MedicalRecord.find({ doctor: req.user.id });
    } 
    // If admin, show all records
    else {
      query = MedicalRecord.find();
    }

    // Populate with patient and doctor info
    query = query.populate({
      path: 'patient',
      select: 'name email'
    }).populate({
      path: 'doctor',
      select: 'name specialization'
    }).populate('appointment');

    const medicalRecords = await query;

    res.status(200).json({
      success: true,
      count: medicalRecords.length,
      data: medicalRecords
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single medical record
// @route   GET /api/medical-records/:id
// @access  Private
exports.getMedicalRecord = async (req, res) => {
  try {
    const medicalRecord = await MedicalRecord.findById(req.params.id)
      .populate({
        path: 'patient',
        select: 'name email'
      })
      .populate({
        path: 'doctor',
        select: 'name specialization'
      })
      .populate('appointment');

    if (!medicalRecord) {
      return res.status(404).json({
        success: false,
        message: `No medical record found with id ${req.params.id}`
      });
    }

    // Make sure user is record owner or doctor who created it or admin
    if (
      req.user.role !== 'admin' &&
      req.user.id !== medicalRecord.patient._id.toString() &&
      req.user.id !== medicalRecord.doctor._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this medical record'
      });
    }

    res.status(200).json({
      success: true,
      data: medicalRecord
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update medical record
// @route   PUT /api/medical-records/:id
// @access  Private/Doctor
exports.updateMedicalRecord = async (req, res) => {
  try {
    let medicalRecord = await MedicalRecord.findById(req.params.id);

    if (!medicalRecord) {
      return res.status(404).json({
        success: false,
        message: `No medical record found with id ${req.params.id}`
      });
    }

    // Make sure user is doctor who created the record or admin
    if (
      req.user.role !== 'admin' &&
      (req.user.role !== 'doctor' || req.user.id !== medicalRecord.doctor.toString())
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this medical record'
      });
    }

    medicalRecord = await MedicalRecord.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: medicalRecord
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete medical record
// @route   DELETE /api/medical-records/:id
// @access  Private/Admin
exports.deleteMedicalRecord = async (req, res) => {
  try {
    const medicalRecord = await MedicalRecord.findById(req.params.id);

    if (!medicalRecord) {
      return res.status(404).json({
        success: false,
        message: `No medical record found with id ${req.params.id}`
      });
    }

    // Make sure user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can delete medical records'
      });
    }

    await medicalRecord.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
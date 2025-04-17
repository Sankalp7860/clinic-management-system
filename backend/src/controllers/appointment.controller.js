const Appointment = require('../models/appointment.model');
const User = require('../models/user.model');

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private
exports.createAppointment = async (req, res) => {
  try {
    // Add patient from logged in user if not specified
    if (!req.body.patient) {
      req.body.patient = req.user.id;
    }

    // Check if doctor exists and is a doctor
    const doctor = await User.findById(req.body.doctor);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(400).json({
        success: false,
        message: 'Invalid doctor selected'
      });
    }

    const appointment = await Appointment.create(req.body);

    res.status(201).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private
exports.getAppointments = async (req, res) => {
  try {
    let query;

    // If user is patient, only show their appointments
    if (req.user.role === 'patient') {
      query = Appointment.find({ patient: req.user.id });
    } 
    // If user is doctor, only show their appointments
    else if (req.user.role === 'doctor') {
      query = Appointment.find({ doctor: req.user.id });
    } 
    // If admin, show all appointments
    else {
      query = Appointment.find();
    }

    // Populate with patient and doctor info
    query = query.populate({
      path: 'patient',
      select: 'name email phone'
    }).populate({
      path: 'doctor',
      select: 'name email specialization'
    });

    const appointments = await query;

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Private
exports.getAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate({
        path: 'patient',
        select: 'name email phone'
      })
      .populate({
        path: 'doctor',
        select: 'name email specialization'
      });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: `No appointment found with id ${req.params.id}`
      });
    }

    // Make sure user is appointment owner or doctor or admin
    if (
      req.user.role !== 'admin' &&
      req.user.id !== appointment.patient._id.toString() &&
      req.user.id !== appointment.doctor._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this appointment'
      });
    }

    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private
exports.updateAppointment = async (req, res) => {
  try {
    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: `No appointment found with id ${req.params.id}`
      });
    }

    // Make sure user is appointment owner or doctor or admin
    if (
      req.user.role !== 'admin' &&
      req.user.id !== appointment.patient.toString() &&
      req.user.id !== appointment.doctor.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this appointment'
      });
    }

    // Patients can only update status to cancelled
    if (
      req.user.role === 'patient' && 
      req.body.status && 
      req.body.status !== 'cancelled'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Patients can only cancel appointments'
      });
    }

    appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: `No appointment found with id ${req.params.id}`
      });
    }

    // Make sure user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can delete appointments'
      });
    }

    await appointment.deleteOne();

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
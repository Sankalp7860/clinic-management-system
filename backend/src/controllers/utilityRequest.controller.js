const UtilityRequest = require('../models/utilityRequest.model');
const User = require('../models/user.model');

// @desc    Create new utility request
// @route   POST /api/utility-requests
// @access  Private (Doctors only)
exports.createUtilityRequest = async (req, res) => {
  try {
    // Add doctor from logged in user
    req.body.doctor = req.user.id;

    // Check if user is a doctor
    if (req.user.role !== 'doctor' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only doctors can create utility requests'
      });
    }

    const utilityRequest = await UtilityRequest.create(req.body);

    res.status(201).json({
      success: true,
      data: utilityRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all utility requests
// @route   GET /api/utility-requests
// @access  Private
exports.getUtilityRequests = async (req, res) => {
  try {
    let query;

    // If user is doctor, only show their requests
    if (req.user.role === 'doctor') {
      query = UtilityRequest.find({ doctor: req.user.id });
    } 
    // If admin, show all requests
    else if (req.user.role === 'admin') {
      query = UtilityRequest.find();
    } else {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view utility requests'
      });
    }

    // Populate with doctor info
    query = query.populate({
      path: 'doctor',
      select: 'name email specialization'
    });

    const utilityRequests = await query;

    res.status(200).json({
      success: true,
      count: utilityRequests.length,
      data: utilityRequests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single utility request
// @route   GET /api/utility-requests/:id
// @access  Private
exports.getUtilityRequest = async (req, res) => {
  try {
    const utilityRequest = await UtilityRequest.findById(req.params.id)
      .populate({
        path: 'doctor',
        select: 'name email specialization'
      });

    if (!utilityRequest) {
      return res.status(404).json({
        success: false,
        message: `No utility request found with id ${req.params.id}`
      });
    }

    // Make sure user is request owner or admin
    if (
      req.user.role !== 'admin' &&
      req.user.id !== utilityRequest.doctor._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this utility request'
      });
    }

    res.status(200).json({
      success: true,
      data: utilityRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update utility request status (admin only)
// @route   PUT /api/utility-requests/:id
// @access  Private (Admin only)
exports.updateUtilityRequestStatus = async (req, res) => {
  try {
    let utilityRequest = await UtilityRequest.findById(req.params.id);

    if (!utilityRequest) {
      return res.status(404).json({
        success: false,
        message: `No utility request found with id ${req.params.id}`
      });
    }

    // Only admin can update status
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can update utility request status'
      });
    }

    // Only allow status and adminNotes to be updated
    const updateData = {
      status: req.body.status,
      adminNotes: req.body.adminNotes
    };

    utilityRequest = await UtilityRequest.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).populate({
      path: 'doctor',
      select: 'name email specialization'
    });

    res.status(200).json({
      success: true,
      data: utilityRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete utility request
// @route   DELETE /api/utility-requests/:id
// @access  Private (Admin only)
exports.deleteUtilityRequest = async (req, res) => {
  try {
    const utilityRequest = await UtilityRequest.findById(req.params.id);

    if (!utilityRequest) {
      return res.status(404).json({
        success: false,
        message: `No utility request found with id ${req.params.id}`
      });
    }

    // Make sure user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can delete utility requests'
      });
    }

    await utilityRequest.deleteOne();

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
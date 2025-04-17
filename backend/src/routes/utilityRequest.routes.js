const express = require('express');
const {
  createUtilityRequest,
  getUtilityRequests,
  getUtilityRequest,
  updateUtilityRequestStatus,
  deleteUtilityRequest
} = require('../controllers/utilityRequest.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(authorize('doctor', 'admin'), getUtilityRequests)
  .post(authorize('doctor', 'admin'), createUtilityRequest);

router.route('/:id')
  .get(authorize('doctor', 'admin'), getUtilityRequest)
  .put(authorize('admin'), updateUtilityRequestStatus)
  .delete(authorize('admin'), deleteUtilityRequest);

module.exports = router;
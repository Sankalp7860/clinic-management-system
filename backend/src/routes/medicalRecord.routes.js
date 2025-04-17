const express = require('express');
const {
  createMedicalRecord,
  getMedicalRecords,
  getMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord
} = require('../controllers/medicalRecord.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getMedicalRecords)
  .post(authorize('doctor', 'admin'), createMedicalRecord);

router.route('/:id')
  .get(getMedicalRecord)
  .put(authorize('doctor', 'admin'), updateMedicalRecord)
  .delete(authorize('admin'), deleteMedicalRecord);

module.exports = router;
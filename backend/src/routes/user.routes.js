const express = require('express');
const {
  getUsers,
  getUser,
  getDoctors,
  updateUser,
  getUnverifiedDoctors,  // Add this import
  verifyDoctor          // Add this import
} = require('../controllers/user.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(authorize('admin'), getUsers);

router.route('/doctors')
  .get(getDoctors);

router.route('/:id')
  .get(getUser)
  .put(updateUser);

router.get('/doctors/unverified', authorize('admin'), getUnverifiedDoctors);
router.put('/doctors/:id/verify', authorize('admin'), verifyDoctor);

module.exports = router;
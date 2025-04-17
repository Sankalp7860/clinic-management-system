const express = require('express');
const {
  getUsers,
  getUser,
  getDoctors,
  getVerifiedDoctors,
  getUnverifiedDoctors,
  updateUser,
  verifyDoctor,
  deleteUser
} = require('../controllers/user.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(authorize('admin'), getUsers);

router.route('/doctors')
  .get(getDoctors);

router.route('/doctors/verified')
  .get(getVerifiedDoctors);

router.route('/doctors/unverified')
  .get(authorize('admin'), getUnverifiedDoctors);

router.route('/doctors/:id/verify')
  .put(authorize('admin'), verifyDoctor);

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(authorize('admin'), deleteUser); // Add delete endpoint

module.exports = router;
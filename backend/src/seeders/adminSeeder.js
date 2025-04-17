const User = require('../models/user.model');

const createAdminUser = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@medicare.com' });

    if (!adminExists) {
      await User.create({
        name: 'System Admin',
        email: 'admin@medicare.com',
        password: 'Admin@123',
        role: 'admin',
        phone: '1234567890',
        gender: 'other'
      });
      console.log('Admin user created successfully');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

module.exports = createAdminUser;
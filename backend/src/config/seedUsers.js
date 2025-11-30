const User = require('../models/User');

// Seed default user accounts
const seedUsers = async () => {
  try {
    // Check if the default user already exists
    const existingUser = await User.findOne({ email: 'yadarohit@gmail.com' });
    
    if (!existingUser) {
      // Create the default user account
      await User.create({
        name: 'Rohit Yada',
        email: 'yadarohit@gmail.com',
        password: 'rohit123',
        role: 'admin',
        studentId: 'ADMIN001'
      });
      console.log('Default user created: yadarohit@gmail.com / rohit123');
    } else {
      console.log('Default user already exists: yadarohit@gmail.com');
    }
  } catch (error) {
    console.error('Error seeding users:', error.message);
  }
};

module.exports = seedUsers;

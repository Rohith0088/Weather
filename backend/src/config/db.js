const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // MongoDB Atlas connection string provided by user
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://yadarohit1235_db_user:zUCkEObfsIJi3btB@cluster0.zo6aemc.mongodb.net/extracurricular?retryWrites=true&w=majority&appName=Cluster0';
    
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000, // Timeout after 10s
    });
    
    console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error('Please check your MongoDB Atlas connection string and ensure your IP is whitelisted.');
    return false;
  }
};

module.exports = connectDB;

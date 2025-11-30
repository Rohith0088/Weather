const app = require('./app');
const connectDB = require('./config/db');
const seedUsers = require('./config/seedUsers');
const port = process.env.PORT || 5000;

// Connect to database and seed default users
const startServer = async () => {
  const connected = await connectDB();
  
  if (connected) {
    // Seed default user accounts
    await seedUsers();
  }
  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

startServer();
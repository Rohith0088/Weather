const app = require('./app');
const port = process.env.PORT || 5000;

// No MongoDB required - using local file storage
console.log('Using local file-based storage (data stored in backend/data/ folder)');

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
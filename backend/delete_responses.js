// delete_responses.js
const mongoose = require('mongoose');
const { Response } = require('./database'); // Import Response model from your database module
require('dotenv').config();

// MongoDB Connection
const dbName = 'engscisurvey';
const mongoURI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.x6tcj.mongodb.net/${dbName}?retryWrites=true&w=majority`;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Could not connect to MongoDB:', err);
    process.exit(1);
  });

const deleteAllResponses = async () => {
  try {
    const result = await Response.deleteMany({}); // Delete all documents in the Response collection
    console.log(`${result.deletedCount} responses have been deleted.`);
  } catch (error) {
    console.error('Error deleting responses:', error);
  } finally {
    mongoose.connection.close(() => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  }
};

deleteAllResponses();

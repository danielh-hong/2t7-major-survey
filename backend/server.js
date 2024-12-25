// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Response } = require('./database');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const dbName = 'engscisurvey'; // Specify your database name
const mongoURI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.x6tcj.mongodb.net/${dbName}?retryWrites=true&w=majority`;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// Initialize Router
const router = express.Router();

// Routes

/**
 * @route   POST /api/survey/submit
 * @desc    Submit a new survey response
 * @access  Public
 */
router.post('/submit', async (req, res) => {
  try {
    const { hasDecided, confirmedMajor, preferences } = req.body;

    // Validate preferences
    if (hasDecided === false && (!preferences || preferences.length !== 3)) {
      return res.status(400).json({ error: 'You must select exactly 3 preferences.' });
    }

    if (hasDecided && !confirmedMajor) {
      return res.status(400).json({ error: 'Confirmed major is required if you have decided.' });
    }

    const newResponse = new Response({
      hasDecided,
      confirmedMajor: hasDecided ? confirmedMajor : undefined,
      preferences: hasDecided ? undefined : preferences
    });

    await newResponse.save();
    res.status(201).json({ message: 'Survey response submitted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @route   GET /api/survey/stats
 * @desc    Get aggregated survey statistics
 * @access  Public
 */
router.get('/stats', async (req, res) => {
  try {
    const totalResponses = await Response.countDocuments();

    // Count decided vs undecided
    const decidedCount = await Response.countDocuments({ hasDecided: true });
    const undecidedCount = totalResponses - decidedCount;

    // Aggregate first choice preferences
    const firstChoiceStats = await Response.aggregate([
      { $match: { hasDecided: false } },
      { $group: { _id: '$preferences.firstChoice', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Aggregate second choice preferences
    const secondChoiceStats = await Response.aggregate([
      { $match: { hasDecided: false } },
      { $group: { _id: '$preferences.secondChoice', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Aggregate third choice preferences
    const thirdChoiceStats = await Response.aggregate([
      { $match: { hasDecided: false } },
      { $group: { _id: '$preferences.thirdChoice', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get all individual responses
    const responses = await Response.find({}, {
      'preferences': 1,
      'hasDecided': 1,
      'confirmedMajor': 1,
      '_id': 0
    }).sort({ submittedAt: -1 }); // Most recent first

    res.json({
      totalResponses,
      decidedCount,
      undecidedCount,
      firstChoiceStats,
      secondChoiceStats,
      thirdChoiceStats,
      responses
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mount the router on /api/survey
app.use('/api/survey', router);

// Fallback Route for Undefined Paths
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

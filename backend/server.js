const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Response, MAJORS, Major } = require('./database');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'https://2t7-major-survey.vercel.app', ], // local development and production
  methods: ['GET', 'POST'],
  credentials: true // Allow credentials (cookies, authorization headers, etc.) to be included in requests
}));
app.use(express.json());

// MongoDB Connection
const dbName = 'engscisurvey'; 
const mongoURI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.x6tcj.mongodb.net/${dbName}?retryWrites=true&w=majority`;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// Seed Majors if not exists
const seedMajors = async () => {
  try {
    const existingMajors = await Major.find();
    if (existingMajors.length === 0) {
      const majorDescriptions = {
        'Aerospace': 'Explore the frontiers of aerospace engineering and space technology.',
        'Biomedical Systems': 'Apply engineering principles to medical and biological challenges.',
        'Electrical & Computer': 'Design innovative electrical and computer systems.',
        'Energy Systems': 'Develop sustainable and efficient energy solutions.',
        'Machine Intelligence': 'Create intelligent systems and advanced machine learning technologies.',
        'Mathematics, Statistics & Finance': 'Apply mathematical and statistical methods to complex financial challenges.',
        'Engineering Physics': 'Investigate fundamental physical principles and their engineering applications.',
        'Robotics': 'Design and develop cutting-edge robotic systems and intelligent machines.'
      };

      const majorsToCreate = MAJORS.map(name => ({
        name,
        description: majorDescriptions[name]
      }));

      await Major.create(majorsToCreate);
      console.log('Majors seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding majors:', error);
  }
};

// Initialize Router
const router = express.Router();

/**
 * @route   POST /api/survey/submit
 * @desc    Submit a new survey response
 * @access  Public
 */
// In your server.js or routes file
router.post('/submit', async (req, res) => {
  try {
    const { hasDecided, confirmedMajor, preferences } = req.body;

    if (!preferences || !preferences.firstChoice || !preferences.secondChoice || !preferences.thirdChoice) {
      return res.status(400).json({ error: 'You must select top 3 preferences.' });
    }

    // Verify choices are different
    const choices = [preferences.firstChoice, preferences.secondChoice, preferences.thirdChoice];
    if (new Set(choices).size !== choices.length) {
      return res.status(400).json({ error: 'Top 3 choices must be different.' });
    }

    if (hasDecided) {
      if (!confirmedMajor) {
        return res.status(400).json({ error: 'Confirmed major is required if you have decided.' });
      }
      if (confirmedMajor !== preferences.firstChoice) {
        return res.status(400).json({ error: 'Your confirmed major must match your first choice!' });
      }
    }

    const newResponse = new Response({ hasDecided, confirmedMajor, preferences });
    await newResponse.save();
    
    res.status(201).json({ message: 'Survey response submitted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @route   GET /api/survey/majors
 * @desc    Get list of available majors with descriptions
 * @access  Public
 */
router.get('/majors', async (req, res) => {
  try {
    const majors = await Major.find({}, 'name description');
    res.json(majors);
  } catch (error) {
    res.status(500).json({ error: error.message });
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

    // Aggregate confirmed majors
    const confirmedMajorStats = await Response.aggregate([
      { $match: { hasDecided: true } },
      { $group: { _id: '$confirmedMajor', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // In your stats endpoint
    const responses = await Response.find({}, {
      'preferences': 1,
      'hasDecided': 1,
      'confirmedMajor': 1,
      'submittedAt': 1,  // Add this line
      '_id': 0
    }).sort({ submittedAt: -1 }); // Most recent first


    res.json({
      totalResponses,
      decidedCount,
      undecidedCount,
      firstChoiceStats,
      secondChoiceStats,
      thirdChoiceStats,
      confirmedMajorStats,
      responses
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mount the router on /api/survey
app.use('/api/survey', router);

// Seed majors on startup
seedMajors();

// Fallback Route for Undefined Paths
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Connected to database: ${dbName}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

module.exports = app;
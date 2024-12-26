const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Response, MAJORS, Major, Visit } = require('./database');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json()); // Add this line to parse JSON bodies
app.use(cors({
  origin: ['http://localhost:5173', 'https://2t7-major-survey.vercel.app'], // Add all allowed origins here
  methods: ['GET', 'POST', 'OPTIONS'], // Include OPTIONS method
  credentials: true // Allow credentials (e.g., cookies, authorization headers)
}));

// Add fallback for preflight response
app.options('*', cors());


// MongoDB Connection
const dbName = 'engscisurvey'; 
const mongoURI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.x6tcj.mongodb.net/${dbName}?retryWrites=true&w=majority`;

// has to be before mongoose connnection
const initializeVisitCounter = async () => {
  try {
    let visitCounter = await Visit.findOne();
    if (!visitCounter) {
      visitCounter = new Visit();
      await visitCounter.save();
    }
    return visitCounter;
  } catch (error) {
    console.error('Error initializing visit counter:', error);
  }
};

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB');
    return initializeVisitCounter();
  })
  .then(() => {
    console.log('Visit counter initialized');
  })
  .catch(err => console.error('Could not connect to MongoDB:', err));

// Initialize Router
const router = express.Router();

// route 4 incrementing visits
router.post('/visit', async (req, res) => {
  try {
    const visitCounter = await Visit.findOneAndUpdate(
      {},
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );
    res.json({ visits: visitCounter.count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
  


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


/**
 * @route   POST /api/survey/submit
 * @desc    Submit a new survey response
 * @access  Public
 */
// In your server.js or routes file
router.post('/submit', async (req, res) => {
  try {
    const { hasDecided, confirmedMajor, preferences, name } = req.body;

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

    // Create new response including the optional name field
    const newResponse = new Response({ 
      hasDecided, 
      confirmedMajor, 
      preferences,
      name: name ? name.trim() : undefined
    });
    
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
// Modify the existing stats endpoint
router.get('/stats', async (req, res) => {
  try {
    const totalResponses = await Response.countDocuments();
    const visitCounter = await Visit.findOne();
    const totalVisits = visitCounter ? visitCounter.count : 0;

    // Count decided vs undecided
    const decidedCount = await Response.countDocuments({ hasDecided: true });
    const undecidedCount = totalResponses - decidedCount;

    // Aggregate first choice preferences - including both decided and undecided
    const firstChoiceStats = await Response.aggregate([
      {
        $facet: {
          // Get counts from undecided responses
          undecided: [
            { $match: { hasDecided: false } },
            { $group: { _id: '$preferences.firstChoice', count: { $sum: 1 } } }
          ],
          // Get counts from decided responses (using confirmedMajor)
          decided: [
            { $match: { hasDecided: true } },
            { $group: { _id: '$confirmedMajor', count: { $sum: 1 } } }
          ]
        }
      },
      // Unwind both arrays
      { $project: {
          combined: {
            $concatArrays: ['$undecided', '$decided']
          }
      }},
      { $unwind: '$combined' },
      // Group by major to combine counts
      {
        $group: {
          _id: '$combined._id',
          count: { $sum: '$combined.count' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Aggregate second choice preferences
    const secondChoiceStats = await Response.aggregate([
      {
        $group: {
          _id: '$preferences.secondChoice',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Aggregate third choice preferences
    const thirdChoiceStats = await Response.aggregate([
      {
        $group: {
          _id: '$preferences.thirdChoice',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get confirmed major stats (for decided students)
    const confirmedMajorStats = await Response.aggregate([
      { $match: { hasDecided: true } },
      { $group: { _id: '$confirmedMajor', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get all responses with submission time
    const responses = await Response.find({}, {
      'preferences': 1,
      'hasDecided': 1,
      'confirmedMajor': 1,
      'submittedAt': 1,
      'name': 1,  // Add this line to include the name field
      '_id': 0
    }).sort({ submittedAt: -1 });

    res.json({
      totalResponses,
      totalVisits,
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
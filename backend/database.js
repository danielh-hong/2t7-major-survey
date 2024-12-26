// database.js
const mongoose = require('mongoose');

const majorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

// database.js
const responseSchema = new mongoose.Schema({
  hasDecided: {
    type: Boolean,
    required: true
  },
  confirmedMajor: {
    type: String,
    required: function() {
      return this.hasDecided;
    }
  },
  preferences: {
    firstChoice: {
      type: String,
      required: true
    },
    secondChoice: {
      type: String,
      required: true
    },
    thirdChoice: {
      type: String,
      required: true
    }
  },
  submittedAt: {
    type: Date,
    default: Date.now  // This will automatically set the current time when a document is created
  }
});

// Update validation to check confirmedMajor matches firstChoice
responseSchema.pre('save', function(next) {
  const choices = [
    this.preferences?.firstChoice,
    this.preferences?.secondChoice,
    this.preferences?.thirdChoice
  ].filter(Boolean);
  
  if (choices.length !== 3) {
    return next(new Error('Three preferences are required'));
  }
  
  // Check for duplicates
  if (new Set(choices).size !== choices.length) {
    return next(new Error('First, second, and third choices must be different'));
  }

  // If decided, confirmedMajor must match firstChoice
  if (this.hasDecided && this.confirmedMajor !== this.preferences.firstChoice) {
    return next(new Error('Your confirmed major must match your first choice'));
  }
  
  next();
});

// Predefined list of majors
const MAJORS = [
  'Aerospace',
  'Biomedical Systems',
  'Electrical & Computer',
  'Energy Systems',
  'Machine Intelligence',
  'Mathematics, Statistics & Finance',
  'Engineering Physics',
  'Robotics'
];

// Method to validate major names
const validateMajor = (major) => {
  return MAJORS.includes(major);
};

// Add major name validation to the schema
responseSchema.path('preferences.firstChoice').validate(validateMajor, 'Invalid first choice major');
responseSchema.path('preferences.secondChoice').validate(validateMajor, 'Invalid second choice major');
responseSchema.path('preferences.thirdChoice').validate(validateMajor, 'Invalid third choice major');
responseSchema.path('confirmedMajor').validate(function(value) {
  return !this.hasDecided || validateMajor(value);
}, 'Invalid confirmed major');


const visitSchema = new mongoose.Schema({
  count: {
    type: Number,
    default: 0
  },
  lastReset: {
    type: Date,
    default: Date.now
  }
});

// Create models
const Visit = mongoose.model('Visit', visitSchema);
const Major = mongoose.model('Major', majorSchema);
const Response = mongoose.model('Response', responseSchema);

module.exports = {
  Major,
  Response,
  Visit,
  MAJORS
};


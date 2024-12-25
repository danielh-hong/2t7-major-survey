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

const responseSchema = new mongoose.Schema({
  hasDecided: {
    type: Boolean,
    required: true,
    default: false
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
  }
});

// Add validation to ensure choices are different
responseSchema.pre('save', function(next) {
  const choices = [
    this.preferences.firstChoice,
    this.preferences.secondChoice,
    this.preferences.thirdChoice
  ];
  
  // Check for duplicates
  if (new Set(choices).size !== choices.length) {
    next(new Error('First, second, and third choices must be different'));
  }
  
  // If hasDecided is true, confirmedMajor must match firstChoice
  if (this.hasDecided && this.confirmedMajor !== this.preferences.firstChoice) {
    next(new Error('Confirmed major must match first choice preference'));
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

// Create models
const Major = mongoose.model('Major', majorSchema);
const Response = mongoose.model('Response', responseSchema);

module.exports = {
  Major,
  Response,
  MAJORS
};
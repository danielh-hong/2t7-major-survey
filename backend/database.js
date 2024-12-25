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

// Create models
const Major = mongoose.model('Major', majorSchema);
const Response = mongoose.model('Response', responseSchema);

module.exports = {
  Major,
  Response
};
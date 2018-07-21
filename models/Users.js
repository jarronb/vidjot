const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserShema = new Schema({
  name: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  password: {
    type: String,
    required: true
  }
});

mongoose.model('users', UserShema);
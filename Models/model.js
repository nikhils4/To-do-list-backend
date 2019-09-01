
const mongoose = require('mongoose');

const user = new mongoose.Schema({
  NAME: {
    type: String,
    required: [true, 'Name is required'],
  },
  EMAIL: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    unique: true,
  },
  PASSWORD: {
    type: String,
    required: [true, 'Password is required'],
  },
  FORGET: {
    type: Boolean,
    default: false
  },
  LIST: {
    type: Array,
  },
	// Future prospect - profile pic upload
  IMAGE_URL: {
		type: String,
		default: 'To be provided'
  },
  IMAGE_ID: {
		type: String,
		default: 'To be provided'
  },
});

module.exports.user = mongoose.model('user', user);
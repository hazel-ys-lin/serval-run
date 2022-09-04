const pool = require('./db');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user_id: Number,
  user_name: String,
  user_email: String,
  user_role: Number,
  user_password: String,
  projects: [Number],
});

const userModel = pool.model('user', userSchema);

module.exports = { userModel };

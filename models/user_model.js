const pool = require('./db');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user_name: String,
  user_email: String,
  user_role: Number,
  user_password: String,
  projects: [
    {
      project_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'project',
      },
      project_name: String,
    },
  ],
});

const userModel = pool.model('user', userSchema);

module.exports = { userModel };

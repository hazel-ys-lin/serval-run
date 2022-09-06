const pool = require('./db');
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'user',
  },
  project_id: Number,
  project_name: String,
  collections: [Number],
});

const collectionSchema = new mongoose.Schema({
  project_id: Number,
  collection_id: Number,
  collection_name: String,
  apis: [Number],
});

const apiSchema = new mongoose.Schema({
  project_id: Number,
  collection_id: Number,
  api_id: Number,
  api_name: String,
});

const projectModel = pool.model('project', projectSchema);
const collectionModel = pool.model('collection', collectionSchema);
const apiModel = pool.model('api', apiSchema);

module.exports = { projectModel, collectionModel, apiModel };

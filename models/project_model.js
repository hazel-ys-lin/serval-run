const pool = require('./db');
const mongoose = require('mongoose');
const { userModel } = require('./user_model');

const projectSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'user',
  },
  project_name: String,
  environments: [
    {
      domain_name: String,
      title: String,
    },
  ],
  collections: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'collection',
    },
  ],
});

const projectModel = pool.model('project', projectSchema);

const projectInsert = async function (userEmail, projectName) {
  const session = await projectModel.startSession();
  session.startTransaction();
  try {
    const opts = { session };
    const userData = await userModel.findOne({ user_email: userEmail });
    await projectModel({
      user_id: userData._id.toString(),
      project_name: projectName,
    }).save(opts);
    await userModel.updateOne(
      { user_email: userEmail },
      { $push: { projects: [projectInsert._id] } },
      opts
    );

    await session.commitTransaction();
    session.endSession();
    return true;
  } catch (error) {
    // If an error occurred, abort the whole transaction and
    // undo any changes that might have happened
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

module.exports = {
  projectModel,
  projectInsert,
};

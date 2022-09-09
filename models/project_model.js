const pool = require('./db');
const mongoose = require('mongoose');
const { userModel } = require('./user_model');
const { projectCheck } = require('../service/dbUpdate_service');

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

const projectInsertModel = async function (projectInfo) {
  console.log('projectInfo in projectinsert model: ', projectInfo);
  const session = await projectModel.startSession();
  session.startTransaction();
  try {
    const opts = { session };
    const userData = await userModel.findOne({
      user_email: projectInfo.userEmail,
    });
    // console.log('userData: ', userData);

    const uniqueProject = await projectCheck(
      projectInfo.projectName,
      userData.projects
    );

    if (uniqueProject) {
      let inserted = await projectModel({
        user_id: userData._id.toString(),
        project_name: projectInfo.projectName,
      }).save(opts);
      // await projectModel.updateOne(
      //   { _id: inserted._id.toString() },
      //   {
      //     $push: {
      //       environments: [
      //         {
      //           domain_name: projectInfo.projectDomain,
      //           title: projectInfo.projectTitle,
      //         },
      //       ],
      //     },
      //   },
      //   opts
      // );

      console.log('inserted._id: ', inserted._id);
      await userModel.updateOne(
        { _id: userData._id.toString() },
        {
          $push: {
            projects: [
              { project_id: inserted._id, project_name: inserted.project_name },
            ],
          },
        },
        opts
      );
    } else {
      return false;
    }

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
  projectInsertModel,
};

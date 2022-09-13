const pool = require('./db');
const mongoose = require('mongoose');
const { apiModel } = require('./collection_model');

const scenarioSchema = new mongoose.Schema({
  api_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'api',
  },
  title: String,
  description: String,
  tags: [String],
  steps: [
    {
      keyword: String,
      keywordType: String,
      text: String,
    },
  ],
  examples: [
    {
      example: {},
      expected_response_body: {},
      expected_status_code: Number,
    },
  ],
});

const scenarioModel = pool.model('scenario', scenarioSchema);

const scenarioGetModel = async function (apiId) {
  let [apiData] = await apiModel.find({
    _id: apiId,
  });
  // console.log('apiData: ', apiData);

  let userScenarios = [];
  if (apiData) {
    for (let i = 0; i < apiData.scenarios.length; i++) {
      let findScenario = await scenarioModel.findOne({
        _id: apiData.scenarios[i].scenario_id,
      });
      if (findScenario !== null) {
        userScenarios.push({
          apiId: apiData._id,
          scenario: findScenario,
        });
      }
    }
  }

  return userScenarios;
};

const scenarioInsertModel = async function (scenarioInfo) {
  const session = await scenarioModel.startSession();
  session.startTransaction();
  try {
    const opts = { session };
    const apiData = await apiModel.findOne({
      _id: scenarioInfo.apiId,
    });

    let exampleArray = [];

    console.log();

    for (let i = 0; i < scenarioInfo.featureCode.testTableBody.length; i++) {
      // let testData = JSON.stringify(scenarioInfo.featureCode.testTableBody[i]);
      exampleArray.push({
        example: scenarioInfo.featureCode.testTableBody[i],
        expected_response_body: {},
        expected_status_code: scenarioInfo.featureCode.testTableBody[i].status,
      });
    }

    let inserted = await scenarioModel({
      api_id: apiData._id.toString(),
      title: scenarioInfo.featureCode.testInfo.title,
      description: scenarioInfo.featureCode.testInfo.description,
      tags: [scenarioInfo.featureCode.testInfo.tag],
      steps: scenarioInfo.featureCode.testStep,
      examples: exampleArray,
    }).save(opts);

    await apiModel.updateOne(
      { api_id: apiData._id.toString() },
      {
        $push: {
          scenarios: [
            { scenario_id: inserted._id, scenario_title: inserted.title },
          ],
        },
      },
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

const scenarioDeleteModel = async function (scenarioInfo) {
  const session = await scenarioModel.startSession();
  session.startTransaction();
  try {
    let deleted = await scenarioModel
      .deleteOne({
        _id: scenarioInfo.scenarioId,
      })
      .session(session);

    await apiModel
      .findOneAndUpdate(
        { _id: scenarioInfo.apiId },
        {
          $pull: {
            scenarios: {
              scenario_id: scenarioInfo.scenarioId,
            },
          },
        }
      )
      .session(session);

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

const testCaseGetModel = async function (scenarioId) {
  let [scenarioData] = await scenarioModel.find({
    _id: scenarioId,
  });
  // console.log(
  //   'scenarioData.examples in testCaseGetModel: ',
  //   scenarioData.examples
  // );

  return scenarioData.examples;
};

module.exports = {
  scenarioModel,
  scenarioGetModel,
  scenarioInsertModel,
  scenarioDeleteModel,
  testCaseGetModel,
};
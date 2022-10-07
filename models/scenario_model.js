const { apiModel, scenarioModel } = require('./db_schemas');

const scenarioGetModel = async function (apiId) {
  let apiData = await apiModel.findOne({
    _id: apiId,
  });

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

    for (let i = 0; i < scenarioInfo.featureCode.testTableBody.length; i++) {
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

    await apiModel
      .updateOne(
        { _id: apiData._id },
        {
          $push: {
            scenarios: [
              { scenario_id: inserted._id, scenario_title: inserted.title },
            ],
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

const scenarioDetailModel = async function (scenarioId) {
  let scenarioInfo = await scenarioModel.findOne({
    _id: scenarioId,
  });

  return { title: scenarioInfo?.title, description: scenarioInfo?.description };
};

const exampleGetModel = async function (scenarioId) {
  let scenarioData = await scenarioModel.findOne({
    _id: scenarioId,
  });

  return { scenario_id: scenarioId, examples: scenarioData.examples };
};

const exampleDetailGetModel = async function (scenarioId, exampleId) {
  let exampleDetail = await scenarioModel.findOne({
    _id: scenarioId,
  });

  for (let i = 0; i < exampleDetail.examples.length; i++) {
    if (exampleDetail.examples[i]._id.toString() === exampleId.toString()) {
      return exampleDetail.examples[i].expected_status_code;
    }
  }
};

module.exports = {
  scenarioGetModel,
  scenarioInsertModel,
  scenarioDetailModel,
  exampleGetModel,
  exampleDetailGetModel,
};

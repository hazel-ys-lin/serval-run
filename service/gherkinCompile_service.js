const Gherkin = require('@cucumber/gherkin');
const Messages = require('@cucumber/messages');
const fs = require('fs');
const path = require('path');

const gherkinCompile = function (featureCode) {
  // FIXME: error handler for gherkin compiler result
  // let featureFile = fs.readFileSync(
  //   path.resolve(__dirname, 'signin.feature'),
  //   'utf8'
  // );

  // src - gherkin compiler library: https://github.com/cucumber/common/tree/main/gherkin
  let uuidFn = Messages.IdGenerator.uuid();
  let builder = new Gherkin.AstBuilder(uuidFn);
  let matcher = new Gherkin.GherkinClassicTokenMatcher();

  // gherkin compile result parse handler
  let gherkinDocument;
  try {
    let parser = new Gherkin.Parser(builder, matcher);
    gherkinDocument = parser.parse(featureCode);
    // console.log('gherkinDocument.feature: ', gherkinDocument.feature);

    if (!gherkinDocument.feature) {
      throw new Error();
    }

    const { name, description } = gherkinDocument.feature; // the name of scenario (required) // the brief description of the scenario (optional)
    if (!name) {
      throw new Error();
    }

    // TODO: to let gherkin users can input more than one scenario one time in one script?
    let testCaseInfo = gherkinDocument.feature.children[0].scenario;
    let tableHeader = testCaseInfo.examples[0].tableHeader; // the params title to send to test target server (required)
    let tableBody = testCaseInfo.examples[0].tableBody; // the test data table (required)
    let steps = testCaseInfo.steps; // the scenario steps, all the sentences human can read (required)

    let testInfo = {
      title: name, // the name of scenario (required)
      description: description, // the brief description of the scenario (required)
      tag: testCaseInfo.tags[0]?.name, // the tag for the scenario, maybe will use it someday.  Minor now (optional)
    };

    if (!testCaseInfo || !tableHeader || !tableBody.length || !steps.length) {
      throw new Error();
    }

    // TODO: put array or object into OOP format?
    let testStep = [];
    let testTableBody = [];
    let testTableHeader = [];

    for (let k = 0; k < steps.length; k++) {
      testStep.push({
        keyword: steps[k].keyword.replace(' ', ''),
        keywordType: steps[k].keywordType,
        text: steps[k].text,
      });
    }

    for (let i = 0; i < tableHeader.cells.length; i++) {
      testTableHeader.push(tableHeader.cells[i].value);
    }

    for (let i = 0; i < tableBody.length; i++) {
      const value = {};
      for (let j = 0; j < tableBody[i].cells.length; j++) {
        value[testTableHeader[j]] = tableBody[i].cells[j].value;
      }
      testTableBody.push(value);
    }
    // let pickles = Gherkin.compile(gherkinDocument, 'gherkinuser.feature', uuidFn);

    return { testInfo, testStep, testTableBody };
  } catch (error) {
    console.log('Gherkin error');
    return false;
  }
};

module.exports = { gherkinCompile };

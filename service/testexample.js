const Gherkin = require('@cucumber/gherkin');
const Messages = require('@cucumber/messages');
const fs = require('fs');
const path = require('path');

const testExample = function () {
  let featureFile = fs.readFileSync(
    path.resolve(__dirname, 'signin.feature'),
    'utf8'
  );

  let uuidFn = Messages.IdGenerator.uuid();
  let builder = new Gherkin.AstBuilder(uuidFn);
  let matcher = new Gherkin.GherkinClassicTokenMatcher(); // or Gherkin.GherkinInMarkdownTokenMatcher()

  let parser = new Gherkin.Parser(builder, matcher);
  let gherkinDocument = parser.parse(featureFile);
  // console.log('gherkinDocument.feature: ', gherkinDocument.feature);
  let testCaseInfo = gherkinDocument.feature.children[0].scenario;
  // console.log('testCaseInfo: ', testCaseInfo);

  let tableHeader =
    gherkinDocument.feature.children[0].scenario.examples[0].tableHeader;
  let tableBody =
    gherkinDocument.feature.children[0].scenario.examples[0].tableBody;
  let steps = gherkinDocument.feature.children[0].scenario.steps;
  // console.log('tableBody: ', tableBody);
  // console.log('tableHeader: ', tableHeader);
  // console.log('steps: ', steps);

  let testInfo = {
    title: gherkinDocument.feature.name,
    description: gherkinDocument.feature.description,
    tag: testCaseInfo.tags[0]?.name,
  };

  // FIXME: put array or object into OOP format?
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

  // console.log('testStep: ', testStep);
  // console.log('testTableBody: ', testTableBody);

  // let pickles = Gherkin.compile(gherkinDocument, 'gherkinuser.feature', uuidFn);

  return { testInfo, testStep, testTableBody };
};

module.exports = { testExample };

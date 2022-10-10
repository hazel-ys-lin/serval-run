const app = require('../socket');
const chai = require('chai');
const deepEqualInAnyOrder = require('deep-equal-in-any-order');
const chaiHttp = require('chai-http');
const { truncateFakeData, createFakeData } = require('./fake_data_generator');

chai.use(chaiHttp);
chai.use(deepEqualInAnyOrder);

const assert = chai.assert;
const expect = chai.expect;
const requester = chai.request(app).keepOpen();

before(async () => {
  await truncateFakeData();
  await createFakeData();
});

module.exports = {
  expect,
  assert,
  requester,
};

let { expect, assert, requester } = require('./set_up');

describe('POST /user/signin', function () {
  it('response success with json', async function () {
    const response = await requester
      .post('/user/signin')
      .set('Accept', 'application/json')
      .send({
        userEmail: 'prettyServal@gmail.com',
        userPassword: '123456',
      });

    expect(response.statusCode).to.equal(200);
  });

  it('response fail with json', async function () {
    const response = await requester
      .post('/user/signin')
      .set('Accept', 'application/json')
      .send({
        userEmail: 'prettyServal@gmail.com',
        userPassword: '223344',
      });

    expect(response.statusCode).to.equal(403);
  });
});

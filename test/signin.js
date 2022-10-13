// let { expect, assert, requester } = require('./set_up');
// let { userSignInModel, userJobModel } = require('../models/user_model');

// describe('validate sign up', () => {
//   it('should return true', async () => {
//     let userInfo = {
//       userEmail: 'prettyServal@gmail.com',
//       userPassword: '123456',
//     };
//     const expectedResult = 'object';
//     expect(typeof (await userSignInModel(userInfo))).to.equal(expectedResult);
//   });
// });

// describe('validate sign up', () => {
//   it('should return false', async () => {
//     const expectedResult = false;
//     let userInfo = {
//       userEmail: 'prettyServal@gmail.com',
//       userPassword: '',
//     };
//     expect(await userSignInModel(userInfo)).to.equal(expectedResult);
//   });
// });

// describe('update user job', () => {
//   it('should return true', async () => {
//     const expectedResult = true;
//     let userId = '6344cc0506a821deb2bdad03';
//     let jobTitle = 'Backend Engineer';
//     expect(await userJobModel(userId, jobTitle)).to.equal(expectedResult);
//   });
// });

// describe('update user job', () => {
//   it('should return false', async () => {
//     const expectedResult = false;
//     let userId = '6344cf30b7183f5d638acfbb';
//     let jobTitle = 'Backend Engineer';
//     expect(await userJobModel(userId, jobTitle)).to.equal(expectedResult);
//   });
// });

// describe('POST /user/signin', function () {
//   it('response success with json', async function () {
//     const response = await requester
//       .post('/user/signin')
//       .set('Accept', 'application/json')
//       .send({
//         userEmail: 'prettyServal@gmail.com',
//         userPassword: '123456',
//       });
//     expect(response.statusCode).to.equal(200);
//   });
//   it('response fail with json', async function () {
//     const response = await requester
//       .post('/user/signin')
//       .set('Accept', 'application/json')
//       .send({
//         userEmail: 'prettyServal@gmail.com',
//         userPassword: '223344',
//       });
//     expect(response.statusCode).to.equal(403);
//   });
// });

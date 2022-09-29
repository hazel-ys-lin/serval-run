// const Cache = require('../util/cache');
// const CHANNEL_KEY = 'report-channel';
// global.usersMap = {};

// const addToUserMapHandler = function (io, socket) {
//   global.subscriber = Cache.duplicate();
//   // subscribe the channel which is watching worker
//   global.subscriber.subscribe(CHANNEL_KEY, (err) => {
//     if (err) {
//       console.error('[Subscriber] Failed to subscribe: %s', err.message);
//     } else {
//       console.log(
//         `[Subscriber] Subscribed successfully! This client is currently subscribed to ${CHANNEL_KEY} channel.`
//       );
//     }
//   });
//   const userId = socket.request.session.userId;

//   if (userId) {
//     console.log('in add to usermap handler: ', socket.id);
//     global.usersMap[userId] = socket.id;

//     global.subscriber.on('message', (channel, result) => {
//       // console.log('message: ', channel, result);
//       let currentResult = JSON.parse(result);
//       console.log('currentResult: ', currentResult);
//       io.to(global.usersMap[userId].socket.id).emit(
//         'progress',
//         currentResult
//         // {
//         //   responseId: responseObject.response_id,
//         //   responseResult: responseObject,
//         // }
//       );
//     });

//     socket.on('disconnect', () => {
//       delete global.usersMap[userId];
//       io.emit('message', 'A user disconnect');
//     });
//   }
// };

// const emitProgressHandler = function (io, socket) {
//   // TODO: if get responses status, emit it to report details
//   // 收到worker publish的訊息之後，就emit到前端
//   // 前端只要有on到emit的事件，都可以收到要傳的資料，和在哪裡傳無關
//   global.subscriber.on('responseStatus', (currentResult) => {
//     let responseObject = JSON.parse(currentResult);
//     // console.log(
//     //   `[Subscriber] Received response ID ${responseObject.response_id} finished`,
//     //   'result: ',
//     //   `${responseObject.result}`
//     // );
//     console.log('currentResult in socket report handler: ', responseObject);
//     io.to(global.usersMap[userId].socket.id).emit('progress', {
//       responseId: responseObject.response_id,
//       responseResult: responseObject,
//     });
//   });
// };

// // const emitSuccessHandler = function (io, socket) {};

// // const emitExampleHandler = function (io, socket) {};

// module.exports = {
//   addToUserMapHandler,
//   emitProgressHandler,
//   // emitSuccessHandler,
//   // emitExampleHandler,
// };

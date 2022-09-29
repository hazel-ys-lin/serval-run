require('dotenv').config();
const Cache = require('./util/cache');
const CHANNEL_KEY = 'report-channel';
const { httpServer, sessionMiddleware } = require('./app');
const Server = require('socket.io');
const port = process.env.PORT;
const io = Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  },
});

// convert a connect middleware to a Socket.IO middleware
const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);

global.subscriber = Cache.duplicate();
// subscribe the channel which is watching worker
global.subscriber.subscribe(CHANNEL_KEY, (err) => {
  if (err) {
    console.error('[Subscriber] Failed to subscribe: %s', err.message);
  } else {
    console.log(
      `[Subscriber] Subscribed successfully! This client is currently subscribed to ${CHANNEL_KEY} channel.`
    );
    io.emit('test', { test: 'test when subscribe' });
  }
});

global.usersMap = {};

// global.subscriber.on('message', (channel, result) => {
//   // console.log('result in subscriber: ', result);
//   let currentResult = JSON.parse(result);
//   io.emit(
//     'progress',
//     {
//       success: Number(currentResult.success),
//       fail: Number(currentResult.fail),
//     }
//     // {
//     //   responseId: responseObject.response_id,
//     //   responseResult: responseObject,
//     // }
//   );
// });

io.use(wrap(sessionMiddleware));

const onConnection = (socket) => {
  const userId = socket.request.session.userId;
  if (userId) {
    // console.log('in add to usermap handler: ', socket.id);

    // TODO: emit to specific report page (need to send back report id from channel)
    global.usersMap[userId] = socket.id;

    // console.log('global.usersMap: ', global.usersMap);

    global.subscriber.on('message', (channel, result) => {
      // console.log('message: ', channel, result);
      let currentResult = JSON.parse(result);
      // console.log('currentResult: ', currentResult);
      io.to(global.usersMap[userId]).emit('progress', {
        success: Number(currentResult.success),
        fail: Number(currentResult.fail),
      });
    });
    socket.on('disconnect', () => {
      delete global.usersMap[userId];
      io.emit('message', 'A user disconnect');
    });
  }
};

// only allow authenticated users
io.use((socket, next) => {
  const session = socket.request.session;
  if (session && session.isAuth) {
    socket.emit('test', { test: 'test' });
    next();
  } else {
    next(new Error('unauthorized'));
  }
}).on('connection', onConnection);

httpServer.listen(port, () => {
  console.log(`Server started on ${port}!`);
});

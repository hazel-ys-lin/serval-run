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
const {
  addToUserMapHandler,
  emitProgressHandler,
  // emitSuccessHandler,
  // emitExampleHandler,
} = require('./socket/reportDetail_handler');

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

global.subscriber.on('message', (channel, result) => {
  let currentResult = JSON.parse(result);
  io.emit(
    'progress',
    {
      success: Number(currentResult.success),
      fail: Number(currentResult.fail),
    }
    // {
    //   responseId: responseObject.response_id,
    //   responseResult: responseObject,
    // }
  );
});

io.use(wrap(sessionMiddleware));

const onConnection = (socket) => {
  // const userId = socket.request.session.userId;
  // if (userId) {
  //   console.log('in add to usermap handler: ', socket.id);
  //   global.usersMap[userId] = socket.id;
  //   global.subscriber.on('message', (channel, result) => {
  //     // console.log('message: ', channel, result);
  //     let currentResult = JSON.parse(result);
  //     console.log('currentResult: ', currentResult);
  //     io.to(global.usersMap[userId].socket.id).emit(
  //       'progress',
  //       currentResult
  //       // {
  //       //   responseId: responseObject.response_id,
  //       //   responseResult: responseObject,
  //       // }
  //     );
  //   });
  //   socket.on('disconnect', () => {
  //     delete global.usersMap[userId];
  //     io.emit('message', 'A user disconnect');
  //   });
  // }
  // addToUserMapHandler(io, socket);
  // emitProgressHandler(io, socket);
};

// only allow authenticated users
io
  // .use((socket, next) => {
  //   const session = socket.request.session;
  //   if (session && session.isAuth) {
  //     socket.emit('test', {test: 'test'});
  //     next();
  //   } else {
  //     next(new Error('unauthorized'));
  //   }
  // })
  .on('connection', onConnection);

httpServer.listen(port, () => {
  console.log(`Server started on ${port}!`);
});

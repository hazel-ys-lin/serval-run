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

// TODO: 建立socket連線後就subscribe redis的channel
global.subscriber = Cache.duplicate();
// subscribe the channel which is watching worker
global.subscriber.subscribe(CHANNEL_KEY, (err) => {
  if (err) {
    console.error('[Subscriber] Failed to subscribe: %s', err.message);
  } else {
    console.log(
      `[Subscriber] Subscribed successfully! This client is currently subscribed to ${CHANNEL_KEY} channel.`
    );
  }
});

// convert a connect middleware to a Socket.IO middleware
const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));

const onConnection = (socket) => {
  addToUserMapHandler(io, socket);
  emitProgressHandler(io, socket);
  // emitSuccessHandler(io, socket);
  // emitExampleHandler(io, socket);
};

// only allow authenticated users
io.use((socket, next) => {
  const session = socket.request.session;
  if (session && session.isAuth) {
    next();
  } else {
    next(new Error('unauthorized'));
  }
}).on('connection', onConnection);

httpServer.listen(port, () => {
  console.log(`Server started on ${port}!`);
});

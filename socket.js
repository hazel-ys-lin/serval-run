const { httpServer, sessionMiddleware } = require('./app');
const Server = require('socket.io');
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  },
});

const {
  connectToPrivateHandler,
  emitProgressHandler,
  emitSuccessHandler,
  emitExampleHandler,
} = require('./socket/reportDetail_handler');

// convert a connect middleware to a Socket.IO middleware
const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));

const onConnection = (socket) => {
  connectToPrivateHandler(io, socket);
  emitProgressHandler(io, socket);
  emitSuccessHandler(io, socket);
  emitExampleHandler(io, socket);
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

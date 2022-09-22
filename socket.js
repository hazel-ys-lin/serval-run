const { httpServer } = require('./app');
const Server = require('socket.io');
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  },
});

const {
  emitProgressHandler,
  emitSuccessHandler,
  emitExampleHandler,
} = require('./socket/reportDetail_handler');

const onConnection = (socket) => {
  emitProgressHandler(io, socket);
  emitSuccessHandler(io, socket), emitExampleHandler(io, socket);
};

io.on('connection', onConnection);

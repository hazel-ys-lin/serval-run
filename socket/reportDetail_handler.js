global.usersMap = {};

const addToUserMapHandler = function (io, socket) {
  const userId = socket.request.session.userId;

  if (userId) {
    global.usersMap[userId] = socket.id;

    socket.on('disconnect', () => {
      delete global.usersMap[userId];
      io.emit('message', 'A user disconnect');
    });
  }
};

const emitProgressHandler = function (io, socket) {
  // TODO: if get responses status, emit it to report details
  // 收到worker publish的訊息之後，就emit到前端
  // 前端只要有on到emit的事件，都可以收到要傳的資料，和在哪裡傳無關
  global.subscriber.on('responseStatus', (message) => {
    let responseObject = JSON.parse(message);
    // console.log(
    //   `[Subscriber] Received response ID ${responseObject.response_id} finished`,
    //   'result: ',
    //   `${responseObject.result}`
    // );
    console.log('responseObject: ', responseObject);
    io.to(global.usersMap[userId].socket.id).emit('progress', {
      responseId: responseObject.response_id,
      responseResult: responseObject.result,
    });
  });
};

// const emitSuccessHandler = function (io, socket) {};

// const emitExampleHandler = function (io, socket) {};

module.exports = {
  addToUserMapHandler,
  emitProgressHandler,
  // emitSuccessHandler,
  // emitExampleHandler,
};

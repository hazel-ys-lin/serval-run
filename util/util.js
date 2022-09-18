require('dotenv').config();
const { promisify } = require('util'); // util from native nodejs library

// reference: https://thecodebarbarian.com/80-20-guide-to-express-error-handling
const wrapAsync = (fn) => {
  return function (req, res, next) {
    // Make sure to `.catch()` any errors and pass them along to the `next()`
    // middleware in the chain, in this case the error handler.
    fn(req, res, next).catch(next);
  };
};

const authentication = (req, res, next) => {
  if (!req.session.isAuth) {
    // console.log('req.session.isAuth: ', req.session.isAuth);
    return res.status(203).json({ msg: 'Please log in' });
  }
  return next;
};

module.exports = {
  wrapAsync,
  authentication,
};

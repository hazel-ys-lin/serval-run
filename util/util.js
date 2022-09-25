require('dotenv').config();
const { check } = require('express-validator');
// const { promisify } = require('util'); // util from native nodejs library

// reference: https://thecodebarbarian.com/80-20-guide-to-express-error-handling
const wrapAsync = (fn) => {
  return function (req, res, next) {
    // Make sure to `.catch()` any errors and pass them along to the `next()`
    // middleware in the chain, in this case the error handler.
    fn(req, res, next).catch(next);
  };
};

const userValidation = function () {
  return [
    // check('userName')
    //   .exists()
    //   .notEmpty()
    //   .withMessage('Serval want to know your name'),
    check('userEmail')
      .isEmail()
      // .isLength({ min: 5, max: 30 })
      .withMessage('Serval cannot verify your email'),
    check('userPassword')
      .isLength({ min: 4, max: 20 })
      .withMessage('Serval wishes you have a safer password'),
  ];
  // if (!userName || !userEmail || !userPassword) {
  //   return res
  //     .status(401)
  //     .json({ msg: 'Please input your information properly' });
  // }
};

const sessionAuth = (req, res, next) => {
  if (!req.session.isAuth) {
    // console.log('req.session.isAuth: ', req.session.isAuth);
    return res.status(401).json({ msg: 'Please log in' });
  }
  return next;
};

module.exports = {
  wrapAsync,
  sessionAuth,
  userValidation,
};

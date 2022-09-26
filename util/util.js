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
};

// Check if a JavaScript string is a URL: https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
const urlValidation = function () {
  return [
    check('domainName')
      .custom((val) => {
        val.match(
          /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
        );
      })
      .withMessage('Please input proper url'),
  ];
};

const sessionAuth = function () {
  return async function (req, res, next) {
    // console.log('in authentication');
    // let accessToken = req.get('Authorization');
    if (!req.session.isAuth) {
      return res.status(403).send({ errorMessages: 'Unauthorized' });
    }

    if (!req.session.isAuth === 'null') {
      return res.status(403).send({ errorMessages: 'Unauthorized' });
    }
    // console.log('next in sessionAuth');
    return next();
  };
  // if (!req.session.isAuth) {
  //   // console.log('req.session.isAuth: ', req.session.isAuth);
  //   return res.status(401).json({ msg: 'Please log in' });
  // }
};

module.exports = {
  wrapAsync,
  urlValidation,
  sessionAuth,
  userValidation,
};

require('dotenv').config();
const express = require('express');
const session = require('express-session');
const morganBody = require('morgan-body');

const app = express();
const httpServer = require('http').createServer(app);

app.use(express.static('public'));
app.set('view engine', 'pug');
app.use(express.json());

morganBody(app);

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}); // save session id to auth
app.use(sessionMiddleware);

app.get('/', (req, res) => {
  res.render('index');
});

app.use('/', [
  require('./routes/scenario_route'),
  require('./routes/project_route'),
  require('./routes/collection_route'),
  require('./routes/report_route'),
  require('./routes/user_route'),
]);

// Handle 404
app.use(function (req, res, next) {
  console.log('404', req.url);
  return res.render('error404');
});

//Handle 500
app.use(function (err, req, res, next) {
  console.log('error handler: ', err);
  return res.render('error500');
});

// app.listen(port, () => {
//   console.log(`Server started on ${port}!`);
// });

module.exports = { httpServer, sessionMiddleware };

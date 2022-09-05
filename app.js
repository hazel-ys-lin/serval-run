require('dotenv').config();
const express = require('express');

const app = express();
const port = process.env.PORT;
const API_VERSION = process.env.API_VERSION;

app.use(express.static('public'));
app.set('view engine', 'pug');
app.use(express.json());

app.get('/', (req, res) => {
  res.render('index');
});

app.use('/api/' + API_VERSION, [
  require('./routes/apitest_route'),
  require('./routes/project_route'),
  require('./routes/user_route'),
]);

// Handle 404
app.use(function (req, res, next) {
  // console.log('req.query: ', req.query);
  console.log('404', req.url);
  return res.status(404).json({ error: 'error: 404' });
});

//Handle 500
app.use(function (err, req, res, next) {
  console.log('error handler: ', err);
  return res.status(500).render('error', { msg: 'error: 500' });
});

app.listen(port, () => {
  console.log(`Server started on ${port}!`);
});

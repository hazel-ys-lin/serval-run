const { userModel } = require('../models/user_model');

const userSign = async (req, res) => {
  return res.render('sign');
};

module.exports = { userSign };

const { userModel } = require('../models/user_model');

const userSign = async (req, res) => {
  return res.render('sign');
};

const userSignUp = async (req, res) => {
  const userEmail = req.body.userEmail;
  const userRole = req.body.userRole;
  const user_instance = new userModel({
    user_email: userEmail,
    user_role: userRole,
  });

  await user_instance.save(function (error) {
    if (error) console.log('user instance error', error);
    else console.log('user inserted');
  });
  // TODO: add project to the user collection

  return res.status(200).json({ message: 'user inserted' });
};

module.exports = { userSign, userSignUp };

// const mongoose = require('mongoose');
// require('dotenv').config();
// const bcrypt = require('bcryptjs');

// const uri = process.env.MONGODB_URI;
// const pool = mongoose.createConnection(uri, {
//   useNewUrlParser: true,
//   serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
//   socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
//   maxPoolSize: 10,
// });

// const userSchemaJson = {
//   user_name: String,
//   user_email: String,
//   user_role: Number,
//   user_job: String,
//   user_password: String,
//   projects: [
//     {
//       project_id: {
//         type: mongoose.Schema.ObjectId,
//         ref: 'project',
//       },
//       project_name: String,
//     },
//   ],
// };
// const userSchema = new mongoose.Schema(userSchemaJson);
// let userModel;

// async function truncateFakeData() {
//   userModel = pool.model('user', userSchema);
//   await userModel.deleteMany();
//   return;
// }

// async function createFakeData() {
//   userModel = pool.model('user', userSchema);
//   await userModel.create({
//     user_name: 'prettyServal',
//     user_email: 'prettyServal@gmail.com',
//     user_role: 2,
//     user_password: bcrypt.hashSync('123456', 5),
//   });

//   return;
// }

// module.exports = { truncateFakeData, createFakeData };

const pool = require('../models/db');
const mongoose = require('mongoose');

const projectCheck = async function (projectName, projectArray) {
  for (let i = 0; i < projectArray.length; i++) {
    if (projectName === projectArray[i].project_name) {
      console.log('project check fail');
      return false;
    }
  }
  console.log('project check pass');
  return true;
};

module.exports = { projectCheck };

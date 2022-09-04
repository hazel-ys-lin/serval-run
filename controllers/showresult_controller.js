const showResult = async (req, res) => {
  return res.render('apitestResult', {
    // response: response.data,
    status: 200,
    // time: testTime,
  });
};

module.exports = { showResult };

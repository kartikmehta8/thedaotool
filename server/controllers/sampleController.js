const sampleFunction = (req, res) => {
  res.send({
    route: '/sample/',
    status: 'OK',
  });
};

module.exports = {
  sampleFunction,
};

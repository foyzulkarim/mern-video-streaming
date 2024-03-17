const setup = (app) => {
  require('./controller').setup(app);
};

module.exports = {
  setup,
};

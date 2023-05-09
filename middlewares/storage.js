const photo = require("../services/photo");

module.exports = () => (req, res, next) => {
  req.storage = {
    ...photo,
  };

  next();
};

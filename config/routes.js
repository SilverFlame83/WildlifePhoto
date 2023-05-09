const authController = require("../controllers/authController");
const homeController = require("../controllers/homeController");
const errorController = require("../controllers/errorController");
const photoCotroller = require("../controllers/photoController");

module.exports = (app) => {
  app.use("/", homeController);
  app.use("/auth", authController);
  app.use("/photo", photoCotroller);
  app.use("*", errorController);
};

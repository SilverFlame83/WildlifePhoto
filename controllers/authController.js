const router = require("express").Router();
const { body, validationResult } = require("express-validator");
const { isGuest } = require("../middlewares/guards");

router.get("/register", isGuest(), (req, res) => {
  res.render("register");
});

router.post(
  "/register",
  isGuest(),
  body("firstName")
    .isAlpha().withMessage('First name must be only with english letters')
    .isLength({ min: 3 })
    .withMessage("First name must be at least 3 characters long"),
  body("lastName")
  .isAlpha().withMessage('Last name must be only with english letters')
    .isLength({ min: 5 })
    .withMessage("Last name must be at least 5 characters long"),
  body("email", "Invalid email").isEmail(),
  body("email")
    .isAlphanumeric().withMessage('Only English letters')
    .isLength({ min: 10 })
    .withMessage("Email must be at least 10 characters long"),
  body("rePass").custom((value, { req }) => {
    if (value != req.body.password) {
      throw new Error("Passwords don't match!");
    }
    return true;
  }),
  async (req, res) => {
    const { errors } = validationResult(req);

    try {
        if (errors.length > 0) {
            throw new Error(
              Object.values(errors)
                .map((e) => e.msg)
                .join("\n")
            );
          }

      await req.auth.register(req.body.firstName,req.body.lastName,req.body.email, req.body.password);

      res.redirect("/");
    } catch (err) {
      console.log(err.message);
      const ctx = {
        errors: err.message.split("\n"),
        userData: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email
        },
      };
      res.render("register", ctx);
    }
  }
);

router.get("/login", isGuest(), (req, res) => {
  res.render("login");
});

router.post("/login", isGuest(), async (req, res) => {
  try {
    await req.auth.login(req.body.email, req.body.password);

    res.redirect("/");
  } catch (err) {
    console.log(err.message);
    let errors = [err.message];
    if (err.type == "credential") {
      errors = ["Incorect email or username!"];
    }
    const ctx = {
      errors,
      userData: {
        email: req.body.email,
      },
    };
    res.render("login", ctx);
  }
});

router.get("/logout", (req, res) => {
  req.auth.logout();
  res.redirect("/");
});

module.exports = router;

// Needed Resources
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities/index");
const regValidate = require('../utilities/account-validation');

// Route to build an account view
router.get("/login", utilities.handleErrors(accountController.buildLogin));
// Route to build an register view
router.get("/register", utilities.handleErrors(accountController.buildRegister));
// Route to register and account
router.post("/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);
// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.loginAccount)
);

module.exports = router;

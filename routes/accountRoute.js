// Needed Resources
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities/index");

// Route to build an account view
router.get("/login", utilities.handleErrors(accountController.buildLogin));
// Route to build an register view
router.get("/register", utilities.handleErrors(accountController.buildRegister));
// Route to register and account
router.post('/register', utilities.handleErrors(accountController.registerAccount))

module.exports = router;

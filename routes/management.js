// Needed Resources
const express = require("express");
const router = new express.Router();
const managementController = require("../controllers/managementController");
const inventoryController = require("../controllers/inventoryController");
const utilities = require("../utilities/index");
const regValidate = require('../utilities/account-validation');

// Route to build an management view
router.get("site-name/inv/", utilities.handleErrors(accountController.buildLogin));
// Route to add a new classification
router.post("/classification",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(managementController.addClassification)
);

// Route to add a new inventory item
router.post("/invetory",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(inventoryController.addInventoryItem)
);


module.exports = router;
// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/inventoryController");
const utilities = require("../utilities/index");

// Route to build inventory by classification view
router.get(
	"/type/:classificationId",
	utilities.handleErrors(invController.buildByClassificationId)
);

// Route to get stpecific item
router.get(
	"/detail/:inventoryId",
	utilities.handleErrors(invController.buildByInventoryId)
);

module.exports = router;

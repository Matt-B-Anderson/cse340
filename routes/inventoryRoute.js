// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/inventoryController");
const utilities = require("../utilities/index");
const classValidate = require("../utilities/classification-validation");
const invValidate = require("../utilities/inventory-validation");

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

// Route to build inventory management view
router.get(
	"/", utilities.handleErrors(invController.buildManagement)
);

// Route to build classification add view
router.get(
	"/add-classification", utilities.handleErrors(invController.buildAddClassificationView)
);

// Route to build inventory add view
router.get(
	"/add-inventory", utilities.handleErrors(invController.buildAddInventoryItemView)
);

// Route to add classification
router.post("/add-classification",
	classValidate.classificationRules(),
	classValidate.checkClassificationData,
	utilities.handleErrors(invController.addClassification)
);


// Route to add new inventory item
router.post("/add-inventory",
	invValidate.invRules(),
	invValidate.checkInvData,
	utilities.handleErrors(invController.addInventoryItem)
);

module.exports = router;

const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
	const classification_id = req.params.classificationId;
	const data = await invModel.getInventoryByClassificationId(classification_id);
	const grid = await utilities.buildClassificationGrid(data);
	let nav = await utilities.getNav();
	const className = data[0].classification_name;
	res.render("./inventory/classification", {
		title: className + " vehicles",
		nav,
		grid,
	});
};

/* ***************************
 *  Build inventory by inventory view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
	const inventory_id = req.params.inventoryId;
	const data = await invModel.getInventoryByInventoryId(inventory_id);
	if (!data) {
		const err = new Error(
			`No vehicles found for inventory Id of ${inventory_id}`
		);
		err.status = 500;
		throw err;
	}
	const html = await utilities.buildInventoryGrid(data);
	let nav = await utilities.getNav();
	const className = data.inv_make;
	res.render("./inventory/inventoryItem", {
		title: className,
		nav,
		html,
	});
};
module.exports = invCont;

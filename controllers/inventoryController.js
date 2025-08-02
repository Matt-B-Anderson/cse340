const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");
const classificationModel = require("../models/classification-model");

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
		messages: [],
		errors: [],
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
		messages: [],
		errors: [],
		html,
	});
};

/* ****************************************
 *  Deliver management view
 * *************************************** */
invCont.buildManagement = async function (req, res, next) {
	let nav = await utilities.getNav();
	res.render("./inventory/management", {
		title: "Inventory Management",
		nav,
		messages: [],
		errors: [],
	});
};

/* ****************************************
 *  Deliver classification add view
 * *************************************** */
invCont.buildAddClassificationView = async function (req, res, next) {
	let nav = await utilities.getNav();
	res.render("./inventory/add-classification", {
		title: "Add a Classification",
		nav,
		messages: [],
		errors: [],
	});
};

/* ****************************************
 *  Deliver inventory add view
 * *************************************** */
invCont.buildAddInventoryItemView = async function (req, res, next) {
	let nav = await utilities.getNav();
	const classificationList = await utilities.buildClassificationList();
	res.render("./inventory/add-inventory", {
		title: "Add an Inventory Item",
		nav,
		messages: [],
		errors: [],
		classificationList,
	});
};

/* ****************************************
 *  Add a classification
 * *************************************** */
invCont.addClassification = async function (req, res, next) {
	const { classification_name } = req.body;

	const classResult = await classificationModel.addClassification(
		classification_name
	);

	let nav = await utilities.getNav();

	if (classResult) {
		req.flash(
			"notice",
			`Congratulations, you\'ve added a new classification ${classification_name}.`
		);
		res.status(200).render("inventory/management", {
			title: "Inventory Management",
			nav,
			messages: [req.flash("notice")],
			errors: [],
		});
	} else {
		req.flash("error", "Sorry, adding a new classification failed.");
		res.status(501).render("inventory/add-classification", {
			title: "Add Classification",
			nav,
			messages: [],
			errors: [req.flash("error")],
			classification_name,
		});
	}
};

/* ****************************************
 *  Add a new inventory item
 * *************************************** */
invCont.addInventoryItem = async function (req, res, next) {
	const {
		inv_make,
		inv_model,
		inv_year,
		inv_description,
		inv_image,
		inv_thumbnail,
		inv_price,
		inv_miles,
		inv_color,
		classification_id,
	} = req.body;

	// always build nav fresh
	let nav = await utilities.getNav();

	try {
		const newItem = await invModel.addInventoryItem(
			inv_make,
			inv_model,
			inv_year,
			inv_description,
			inv_image,
			inv_thumbnail,
			inv_price,
			inv_miles,
			inv_color,
			classification_id
		);

		if (!newItem || !newItem.inv_id) {
			throw new Error("Insert succeeded but no row was returned");
		}

		req.flash(
			"notice",
			`Congratulations, you’ve added ${newItem.inv_make} ${newItem.inv_model}!`
		);

		return res.status(200).render("inventory/management", {
			title: "Inventory Management",
			nav,
			messages: [req.flash("notice")],
			errors: [],
		});
	} catch (error) {
		console.error("Add inventory error:", error);

		req.flash("error", "Sorry, the new inventory item creation failed.");
		req.flash("error", error.message);

		const classificationList = await utilities.buildClassificationList(
			classification_id
		);

		return res.status(400).render("inventory/add-inventory", {
			title: "Add an Inventory Item",
			nav,
			messages: [],
			errors: [req.flash("error")],
			classificationList,
			inv_make,
			inv_model,
			inv_year,
			inv_description,
			inv_image,
			inv_thumbnail,
			inv_price,
			inv_miles,
			inv_color,
			classification_id,
		});
	}
};

module.exports = invCont;

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

/* ****************************************
*  Deliver management view
* *************************************** */
invCont.buildManagement = async function(req, res, next) {
  let nav = await utilities.getNav()
  const message = req.flash("notice, 'test' ")
  res.render("./inventory/management", {
	title: "Inventory Management",
	nav,
	messages: message
  })
}

/* ****************************************
*  Add a classification
* *************************************** */
invCont.addClassification = async function(req, res, next) {
  let nav = await utilities.getNav()
  const { classification_name} = req.body

  const classResult = await classificationModel.addClassification(
	classification_name
  )

  if (classResult) {
	req.flash(
	  "notice",
	  `Congratulations, you\'ve added a new classification ${classification_name}.`
	)
	res.status(201).render("inv/", {
	  title: "Inventory Management",
	  nav,
	})
  } else {
	req.flash("notice", "Sorry, adding a new classification failed.")
	res.status(501).render("inv/add-classification", {
	  title: "Add Classification",
	  nav,
	})
  }
  
}

/* ****************************************
*  Add a new inventory item
* *************************************** */
invCont.addInventoryItem = async function(req, res, next) {
  let nav = await utilities.getNav()
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
        classification_name
   } = req.body

  const invResult = await invModel.addInventoryItem(
		inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_name
  )

  if (invResult) {
	req.flash(
	  "notice",
	  `Congratulations, you\'ve added a new inventory item ${inv_model} to the ${classification_name} classification.`
	)
	res.status(201).render("inv/", {
	  title: "Inventory Management",
	  nav,
	})
  } else {
	req.flash("notice", "Sorry, the new inventory item creation failed.")
	res.status(501).render("inv/inventory-add", {
	  title: "Add Inventory Item",
	  nav,
	})
  }
  
}

module.exports = invCont;

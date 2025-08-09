const invModel = require("../models/inventory-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
	let data = await invModel.getClassifications();
	let list = "<ul>";
	list += '<li><a href="/" title="Home page">Home</a></li>';
	data.rows.forEach((row) => {
		list += "<li>";
		list +=
			'<a href="/inv/type/' +
			row.classification_id +
			'" title="See our inventory of ' +
			row.classification_name +
			' vehicles">' +
			row.classification_name +
			"</a>";
		list += "</li>";
	});
	list += "</ul>";
	return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
	let grid;
	if (data.length > 0) {
		grid = '<ul id="inv-display">';
		data.forEach((vehicle) => {
			grid += "<li>";
			grid +=
				'<a href="../../inv/detail/' +
				vehicle.inv_id +
				'" title="View ' +
				vehicle.inv_make +
				" " +
				vehicle.inv_model +
				' details">';

			// IMAGE WRAPPER
			grid += '<div class="inventory-image">';
			grid +=
				'<img src="' +
				vehicle.inv_thumbnail +
				'" ' +
				'alt="Image of ' +
				vehicle.inv_make +
				" " +
				vehicle.inv_model +
				'">';
			grid += "</div>";

			// DETAILS WRAPPER
			grid += '<div class="inventory-details">';
			grid += "<h2>" + vehicle.inv_make + " " + vehicle.inv_model + "</h2>";
			grid +=
				"<span>$" +
				new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
				"</span>";
			grid += "</div>";

			grid += "</a>";
			grid += "</li>";
		});
		grid += "</ul>";
	} else {
		grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
	}
	return grid;
};
/* **************************************
 * Build the inventory view HTML
 * ************************************ */
Util.buildInventoryGrid = async function (data, opts = {}) {
  const { isLoggedIn = false, isFavorite = false } = opts;
  let html = "";

  if (data) {
    html += `
<section class="inv-detail">
  <!-- left: gallery -->
  <div class="inv-gallery">
    <div class="inv-main">
      <img src="${data.inv_image}" alt="${data.inv_make} ${data.inv_model}">
    </div>
    <ul class="inv-thumbs">
      ${
        data.inv_images
          ?.map(
            (src) => `<li><img src="${src}" alt="${data.inv_make} ${data.inv_model}"></li>`
          )
          .join("") ?? ""
      }
    </ul>
  </div>

  <!-- right: info -->
  <div class="inv-info">
    <h1>${data.inv_year} ${data.inv_make} ${data.inv_model}</h1>

    <div class="inv-price-block">
      <div class="inv-price-label">Price</div>
      <div class="inv-price">$${new Intl.NumberFormat("en-US").format(data.inv_price)}</div>
      <div class="inv-mileage">${new Intl.NumberFormat("en-US").format(data.inv_miles)} miles</div>
    </div>

    <ul class="inv-specs">
      <li><strong>Mileage:</strong> ${new Intl.NumberFormat("en-US").format(data.inv_miles)}</li>
      <li><strong>Ext. Color:</strong> ${data.inv_color}</li>
    </ul>

    ${
      isLoggedIn
        ? isFavorite
          ? `
            <form method="post" action="/favorites/${data.inv_id}/delete" style="display:inline;">
              <button class="button button-secondary">Remove from Saved</button>
            </form>
          `
          : `
            <form method="post" action="/favorites/${data.inv_id}" style="display:inline;">
              <button class="button">Save</button>
            </form>
          `
        : ""
    }
  </div>
</section>
`;
  } else {
    html = `<p class="notice">Sorry, no vehicle details available.</p>`;
  }

  return html;
};

Util.buildClassificationList = async function (classification_id = null) {
	let data = await invModel.getClassifications();
	let classificationList =
		'<select name="classification_id" id="classificationList" required>';
	classificationList += "<option value=''>Choose a Classification</option>";
	data.rows.forEach((row) => {
		classificationList += '<option value="' + row.classification_id + '"';
		if (
			classification_id != null &&
			row.classification_id == classification_id
		) {
			classificationList += " selected ";
		}
		classificationList += ">" + row.classification_name + "</option>";
	});
	classificationList += "</select>";
	return classificationList;
};

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
	if (res.locals.loggedin) {
		next();
	} else {
		req.flash("notice", "Please log in.");
		return res.redirect("/account/login");
	}
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
	Promise.resolve(fn(req, res, next)).catch(next);

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
    res.locals.accountData = null;
	if (req.cookies.jwt) {
		jwt.verify(
			req.cookies.jwt,
			process.env.ACCESS_TOKEN_SECRET,
			function (err, accountData) {
				if (err) {
					req.flash("Please log in");
					res.clearCookie("jwt");
					return res.redirect("/account/login");
				}
				res.locals.accountData = accountData;
				res.locals.loggedin = 1;
				next();
			}
		);
	} else {
		next();
	}
};

/* ****************************************
 * Middleware to check role
 **************************************** */
Util.requireRole = (allowedRoles = []) => {
    return (req, res, next ) => {
        const acct = res.locals.accountData;

        if (!acct) {
            req.flash('error', 'Please log in to continue.');
            return res.redirect('/account/login');
        }

        if (!allowedRoles.includes(acct.account_type)) {
            req.flash('error', 'You do not have permission to access that page');
            return res.redirect('/account/login')
        }
        next();
    };
};

module.exports = Util;

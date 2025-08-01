const utilities = require("../utilities/index");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
	let nav = await utilities.getNav();
	res.render("./account/login", {
		title: "Login",
		nav,
		messages: req.flash("notice") || [],
		errors: [],
	});
}

/* ****************************************
 *  Deliver register view
 * *************************************** */
async function buildRegister(req, res, next) {
	let nav = await utilities.getNav();
	res.render("./account/register", {
		title: "Register",
		nav,
		messages: req.flash("notice") || [],
		errors: [],
	});
}
/* ****************************************
 *  Register an account
 * *************************************** */
async function registerAccount(req, res, next) {
	let nav = await utilities.getNav();
	const {
		account_firstname,
		account_lastname,
		account_email,
		account_password,
	} = req.body;

	// Hash the password before storing
	let hashedPassword;
	try {
		// regular password and cost (salt is generated automatically)
		hashedPassword = bcrypt.hashSync(account_password, 10);
	} catch (error) {
		req.flash(
			"notice",
			"Sorry, there was an error processing the registration."
		);
		res.status(500).render("account/register", {
			title: "Registration",
			nav,
			errors: null,
		});
	}

	console.log("Controller: about to register:", account_email);
	const regResult = await accountModel.registerAccount(
		account_firstname,
		account_lastname,
		account_email,
		hashedPassword
	);

	console.log("Controller: registerAccount returned:", regResult);

	if (regResult) {
		req.flash(
			"notice",
			`Congratulations, you\'re registered ${account_firstname}. Please log in.`
		);
		res.status(201).render("account/login", {
			title: "Login",
			nav,
			messages: [],
			errors: [],
		});
	} else {
		req.flash("notice", "Sorry, the registration failed.");
		res.status(501).render("account/register", {
			title: "Registration",
			nav,
			messages: [],
			errors: [],
		});
	}
}

/* ****************************************
 *  Login
 * *************************************** */
async function loginAccount(req, res, next) {
	const { account_email, account_password } = req.body;
	const nav = await utilities.getNav();

	let accountData;
	try {
		accountData = await accountModel.getAccountByEmail(account_email);
	} catch (err) {
		return next(err);
	}

	if (!accountData) {
		req.flash("notice", "Email or password is incorrect.");
		return res.status(400).render("account/login", {
			title: "Login",
			nav,
			errors: [],
		});
	}

	const passwordMatches = bcrypt.compareSync(
		account_password,
		accountData.account_password
	);
	if (!passwordMatches) {
		req.flash("notice", "Email or password is incorrect.");
		return res.status(400).render("account/login", {
			title: "Login",
			nav,
			errors: [],
		});
	}

	delete accountData.account_password;
	req.session.account = {
		account_id: accountData.account_id,
		account_firstname: accountData.account_firstname,
		account_type: accountData.account_type,
	};
	return res.redirect("/");
}
module.exports = { buildLogin, buildRegister, registerAccount, loginAccount };

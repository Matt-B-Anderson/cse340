const utilities = require("../utilities/index");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

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
 *  Deliver account view
 * *************************************** */
async function buildAccount(req, res, next) {
	let nav = await utilities.getNav();
	res.render("./account/account", {
		title: "Account Management",
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
			errors: [],
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
async function accountLogin(req, res) {
	let nav = await utilities.getNav();
	const { account_email, account_password } = req.body;

	console.log(`$$$$$$$$$$$: ${account_email}, ${account_password}`);
	const accountData = await accountModel.getAccountByEmail(account_email);
	console.log(`**********************************: ${accountData}`);
	if (!accountData) {
		req.flash("notice", "Please check your credentials and try again.");
		res.status(400).render("account/login", {
			title: "Login",
			nav,
			errors: [],
			account_email,
		});
		return;
	}
	try {
		if (await bcrypt.compare(account_password, accountData.account_password)) {
			delete accountData.account_password;
			const accessToken = jwt.sign(
				accountData,
				process.env.ACCESS_TOKEN_SECRET,
				{ expiresIn: 3600 * 1000 }
			);
			if (process.env.NODE_ENV === "development") {
				res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
			} else {
				res.cookie("jwt", accessToken, {
					httpOnly: true,
					secure: true,
					maxAge: 3600 * 1000,
				});
			}
			req.flash("notice", "You have logged in");
            res.status(200).render("account/account", {
                title: "Account Management",
                nav,
                errors: [],
                account_firstname: accountData.account_firstname,
                account_email,
                account_type: accountData.account_type
            })
		} else {
			req.flash(
				"notice",
				"Please check your credentials and try again."
			);
			res.status(400).render("account/login", {
				title: "Login",
				nav,
				errors: [],
				account_email,
			});
		}
	} catch (error) {
		throw new Error("Access Forbidden");
	}
}
/* ****************************************
 *  Build update account view
 * *************************************** */
async function buildUpdateAccountView(req, res, next) {
    let nav = await utilities.getNav();
    const account_id = parseInt(req.params.account_id)
    const account = await accountModel.getAccountById(account_id);
    if (account){
        res.status(200).render("account/update-account", {
            title: "Update Account",
            nav,
            errors: [],
            messages: [],
            account_id,
		    account_firstname: account.account_firstname,
		    account_lastname: account.account_lastname,
		    account_email: account.account_email
        })
    }
}


/* ****************************************
 *  Update account info
 * *************************************** */
async function updateAccountInfo(req, res, next) {
    let nav = await utilities.getNav();
    const {
        account_id,
		account_firstname,
		account_lastname,
		account_email
	} = req.body;
    const updateAccountInfo = await accountModel.updateAccountInfo(
        account_id,
		account_firstname,
		account_lastname,
		account_email
    )
    if (updateAccountInfo) {
        req.flash("notice", "Your account info was successfully updated");
        res.redirect("/account/");
    } else {
        req.flash("error", "The account update failed");
        req.status(501).render("account/update-account", {
            title: "Update Account",
            nav,
            errors: [],
            account_id,
		    account_firstname,
		    account_lastname,
		    account_email
        })
    }
}

/* ****************************************
 *  Update account password
 * *************************************** */
async function updateAccountPassword(req, res, next) {
    let nav = await utilities.getNav();
    const {
        account_id,
		account_password
	} = req.body;
    const hashedPassword = bcrypt.hashSync(account_password, 10);
    const updateAccountInfo = await accountModel.updateAccountInfo(
        account_id,
		hashedPassword
    )
    if (updateAccountInfo) {
        req.flash("notice", "Your account password was successfully updated");
        res.redirect("/account/");
    } else {
        req.flash("error", "The account password update failed");
        req.status(501).render("account/update-account", {
            title: "Update Account",
            nav,
            errors: [],
            account_id
        })
    }
}

/* ****************************************
 *  Logout
 * *************************************** */
async function logout(req, res, next) {
    res.clearCookie('jwt');
    res.redirect('/');
}

module.exports = {
	buildLogin,
	buildRegister,
	buildAccount,
	registerAccount,
	accountLogin,
    buildUpdateAccountView,
    updateAccountInfo,
    updateAccountPassword,
    logout
};

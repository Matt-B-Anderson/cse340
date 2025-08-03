const pool = require("../database/");

/* *****************************
 *   Register new account
 * *************************** */
async function registerAccount(
	account_firstname,
	account_lastname,
	account_email,
	account_password
) {
	try {
		const sql =
			"INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
		const result = pool.query(sql, [
			account_firstname,
			account_lastname,
			account_email,
			account_password,
		]);
		return result.rows[0];
	} catch (error) {
		return error.message;
	}
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email) {
	try {
		const sql = "SELECT * FROM account WHERE account_email = $1";
		const email = await pool.query(sql, [account_email]);
		return email.rowCount;
	} catch (error) {
		return error.message;
	}
}

/* **********************
 *   Get account by email
 * ********************* */
async function getAccountByEmail(account_email) {
	try {
		const result = await pool.query(
			"SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1",
			[account_email]
		);
		return result.rows[0];
	} catch (error) {
		return new Error("No matching email found");
	}
}

/* **********************
 *   Get account by email
 * ********************* */
async function getAccountById(account_id) {
	try {
		const result = await pool.query(
			"SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_id = $1",
			[account_id]
		);
		return result.rows[0];
	} catch (error) {
		return new Error("No matching email found");
	}
}

/* **********************
 *   Udate account info
 * ********************* */
async function updateAccountInfo(account_id, account_firstname, account_lastname, account_email) {
	try {
		const result = await pool.query(
			`UPDATE account
                SET account_firstname=$1,
                    account_lastname=$2,
                    account_email=$3
                WHERE account_id=$4
            RETURNING account_id`,
			[account_firstname, account_lastname, account_email, account_id]
		);
		return result.rows[0];
	} catch (error) {
		return new Error("No matching email found");
	}
}

/* **********************
 *   Udate account password
 * ********************* */
async function updateAccountPassword(account_id, account_password) {
	try {
		const result = await pool.query(
			`UPDATE account SET account_password=$1 WHERE account_id=$2`,
			[account_password, account_id]
		);
		return result.rows[0];
	} catch (error) {
		return new Error("No matching email found");
	}
}

module.exports = {
	registerAccount,
	checkExistingEmail,
	getAccountByEmail,
    getAccountById,
    updateAccountInfo,
    updateAccountPassword
};

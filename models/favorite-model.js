const pool = require("../database");

/* **********************
 *   Add a vehicle to favorites
 * ********************* */
async function addFavorite(account_id, inv_id) {
  const sql = `INSERT INTO favorite (account_id, inv_id)
               VALUES ($1,$2)
               ON CONFLICT (account_id, inv_id) DO NOTHING
               RETURNING *;`;
  const { rows } = await pool.query(sql, [account_id, inv_id]);
  return rows[0] ?? null;
}

/* **********************
 *   Remove a vehicle from favorites
 * ********************* */
async function removeFavorite(account_id, inv_id) {
  await pool.query(`DELETE FROM favorite WHERE account_id=$1 AND inv_id=$2`, [account_id, inv_id]);
}

/* **********************
 *   Get the users favorites
 * ********************* */
async function listFavorites(account_id) {
  const sql = `
    SELECT i.*, c.classification_name
    FROM favorite f
    JOIN inventory i ON i.inv_id = f.inv_id
    JOIN classification c ON c.classification_id = i.classification_id
    WHERE f.account_id = $1
    ORDER BY f.created_at DESC`;
  const { rows } = await pool.query(sql, [account_id]);
  return rows;
}

/* **********************
 *   Get a favorite by Id
 * ********************* */
async function isFavorite(account_id, inv_id) {
  const { rows } = await pool.query(
    `SELECT 1 FROM favorite WHERE account_id=$1 AND inv_id=$2`,
    [account_id, inv_id]
  );
  return rows.length > 0;
}

module.exports = { addFavorite, removeFavorite, listFavorites, isFavorite };
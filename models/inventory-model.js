const pool = require("../database/");

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
	return await pool.query(
		"SELECT * FROM public.classification ORDER BY classification_name"
	);
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
	const data = await pool.query(
		`SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
		[classification_id]
	);
	return data.rows;
}

async function getInventoryByInventoryId(inv_id) {
	const data = await pool.query(
		`SELECT * FROM public.inventory AS i where i.inv_id = $1`,
		[inv_id]
	);
	return data.rows[0];
}

async function addInventoryItem(
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
) {
  try {
    const sql = `
      INSERT INTO inventory
        (inv_make,
         inv_model,
         inv_year,
         inv_description,
         inv_image,
         inv_thumbnail,
         inv_price,
         inv_miles,
         inv_color,
         classification_id)
      VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *;
    `;

    const insertRes = await pool.query(sql, [
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
    ]);

    return insertRes.rows[0];

  } catch (err) {
    console.error("Model.addInventoryItem error:", err);
    throw err;
  }
}

module.exports = {
	getClassifications,
	getInventoryByClassificationId,
	getInventoryByInventoryId,
	addInventoryItem
};

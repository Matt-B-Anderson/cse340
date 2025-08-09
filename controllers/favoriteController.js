const favModel = require("../models/favorite-model");
const utilities = require("../utilities");

const favController = {

/* ****************************************
 *  Build favorite view
 * *************************************** */
  list: async (req, res) => {
    const nav = await utilities.getNav();
    const data = await favModel.listFavorites(res.locals.accountData.account_id);
    const grid = await utilities.buildClassificationGrid(data); // reuse grid helper
    res.render("account/favorites", { title: "My Saved Vehicles", nav, grid, messages: [], errors: [] });
  },

/* ****************************************
 *  Add vehicle to favorites
 * *************************************** */
  add: async (req, res) => {
    const account_id = res.locals.accountData.account_id;
    const inv_id = Number(req.params.inv_id);
    await favModel.addFavorite(account_id, inv_id);
    res.redirect("back");
  },

/* ****************************************
 *  Remove a vehicle from favorites
 * *************************************** */
  remove: async (req, res) => {
    const account_id = res.locals.accountData.account_id;
    const inv_id = Number(req.params.inv_id);
    await favModel.removeFavorite(account_id, inv_id);
    res.redirect("back");
  },
};

module.exports = favController;
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const favController = require("../controllers/favoriteController");

router.get("/", utilities.checkLogin, utilities.handleErrors(favController.list));
router.post("/:inv_id", utilities.checkLogin, utilities.handleErrors(favController.add));
router.post("/:inv_id/delete", utilities.checkLogin, utilities.handleErrors(favController.remove));

module.exports = router;
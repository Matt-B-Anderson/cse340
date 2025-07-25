const utilities = require(".")
  const { body, validationResult } = require("express-validator");
  const validate = {}

  /*  **********************************
  *  Classification Data Validation Rules
  * ********************************* */
  validate.classificationRules = () => {
    return [
      // classification is required and must be string
      body("classification_name")
      .trim()
      .notEmpty()
      .withMessage("Classification name is required")
      .isLength({ min: 1 })
      .withMessage("Classification name must be at least 1 character")
      .isAlphanumeric()
      .withMessage("Classification name may only contain letters and numbers (no spaces or special characters)")
      .escape(),
    ];
  };

  /* ******************************
 * Check data and return errors or continue to add classification
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const {classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inv/add-classification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name
    })
    return
  }
  next()
}

module.exports = validate
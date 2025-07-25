const utilities = require(".")
const { body, validationResult } = require("express-validator");
const validate = {}

/*  **********************************
*  Inventory Data Validation Rules
* ********************************* */
validate.invRules = () => {
    return [
        // inv_make is required and must be string
        body("inv_make")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a make."), // on error this message is sent.

        // inv_model is required and must be string
        body("inv_model")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage("Please provide a model."), // on error this message is sent.

        // inv_year is requried and must be 4 numbers
        body("inv_year")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 4, max: 4 })
            .isNumeric()
            .withMessage("A valid year is required."),

        // inv_description is required and must be a string
        body("inv_description")
            .trim()
            .notEmpty()
            .isLength({ min: 10 })
            .withMessage("Inventory description must be at least 10 characters."),

        // inv_image is required and must be a string
        body("inv_image")
            .trim()
            .notEmpty()
            .isLength({min: 12})
            .contains("/")
            .withMessage("Inventory image must be a path and contain at least 12 characters."),

        // inv_thumbnail is required and must be a string
        body("inv_thumbnail")
            .trim()
            .notEmpty()
            .isLength({min: 12})
            .contains("/")
            .withMessage("Inventory thumbnail must be a path and contain at least 12 characters."),

        // inv_price is required and must be a number
        body("inv_price")
            .trim()
            .notEmpty()
            .isLength({min: 3})
            .isNumeric()
            .withMessage("Inventory price must be a number and at least 3 characters long."),
        
        // inv_miles is required and must be a number
        body("inv_miles")
            .trim()
            .notEmpty()
            .isLength({min: 1})
            .isNumeric()
            .withMessage("Inventory miles must be a number."),

        // inv_color is required and must be a string
        body("inv_color")
            .trim()
            .notEmpty()
            .isLength({min: 3})
            .withMessage("Inventory color must be a string."),

        // classification_name is required and must be selected
        body("classification_name")
            .trim()
            .notEmpty()
            .withMessage("A classification name must be selected")
    ];
};

/* ******************************
* Check data and return errors or continue to inventory item creation
* ***************************** */
validate.checkInvData = async (req, res, next) => {
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
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/register", {
            errors,
            title: "Registration",
            nav,
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
        })
        return
    }
    next()
}

module.exports = validate
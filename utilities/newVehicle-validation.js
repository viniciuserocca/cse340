const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const invModel = require("../models/inventory-model")

validate.inventoryRules = () => {
  return [
    body("classification_id")
      .notEmpty()
      .withMessage("Classification is required."),

    body("inv_make")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Make must be at least 3 characters long.")
      .matches(/^[A-Za-z0-9\s]+$/)
      .withMessage("Make can only contain letters, numbers, and spaces.")
      .custom(async (value, { req }) => {
        const exists = await invModel.checkExistingVehicle(
          value,
          req.body.inv_model,
          req.body.inv_year
        )
        if (exists) {
          throw new Error("That vehicle already exists.")
        }
      }),

    body("inv_model")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Model must be at least 3 characters long.")
      .matches(/^[A-Za-z0-9\s]+$/)
      .withMessage("Model can only contain letters, numbers, and spaces."),

    body("inv_description")
      .trim()
      .notEmpty()
      .withMessage("Description is required."),

    body("inv_image")
      .trim()
      .notEmpty()
      .withMessage("Image path is required."),

    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Thumbnail path is required."),

    body("inv_price")
      .trim()
      .isDecimal()
      .withMessage("Price must be a valid number (integer or decimal)."),

    body("inv_year")
      .trim()
      .matches(/^\d{4}$/)
      .withMessage("Year must be a 4-digit number."),

    body("inv_miles")
      .trim()
      .isInt()
      .withMessage("Miles must be an integer."),

    body("inv_color")
      .trim()
      .notEmpty()
      .withMessage("Color is required.")
      .matches(/^[A-Za-z]+$/)
      .withMessage("Color must contain only letters."),
  ]
}

validate.checkInventoryData = async (req, res, next) => {
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
    classification_id
  } = req.body

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList(classification_id)

    res.render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      errors,
      classificationList,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color
    })
    return
  }

  next()
}


module.exports = validate
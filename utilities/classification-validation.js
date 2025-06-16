const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const invModel = require("../models/inventory-model")

validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .notEmpty()
      .withMessage("Classification name is required.")
      .matches(/^[A-Za-z]+$/)
      .withMessage("Provide a correct classification name.")
      .custom(async (classification_name) => {
        const exists = await invModel.checkExistingClassification(classification_name)
        if (exists) {
          throw new Error("That classification already exists.")
        }
      }),
  ]
}

validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body

  let errors = []
  errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Add New Classification",
      nav,
      classification_name,
    })
    return
  }

  next()
}

validate.checkUpdateClassificationData = async (req, res, next) => {
  const { classification_name, classification_id } = req.body

  let errors = []
  errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/edit-classification", {
      errors,
      title: "Edit Classification",
      nav,
      classification_name,
      classification_id
    })
    return
  }

  next()
}

validate.classificationDeleteRules = () => {
  return [
    body("classification_id")
      .notEmpty()
      .withMessage("Classification ID is required.")
      .bail()
      .custom(async (classification_id) => {
        const hasInventory = await invModel.checkExistingInventory(classification_id)
        if (hasInventory) {
          throw new Error("Cannot delete classification with existing inventory.")
        }
      }),
  ]
}

validate.checkDeleteClassificationData = async (req, res, next) => {
  const { classification_name, classification_id } = req.body

  let errors = []
  errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/delete-classification", {
      errors,
      title: "Delete Classification",
      nav,
      classification_name,
      classification_id
    })
    return
  }

  next()
}

module.exports = validate
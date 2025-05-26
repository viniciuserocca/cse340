const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build specific inventory item detail view
 * ************************** */
invCont.buildItemDetails = async function (req, res, next) {
  const inventory_id = req.params.invId
  const data = await invModel.getItemDetails(inventory_id)
  const grid = await utilities.buildDetailsGrid(data)
  let nav = await utilities.getNav()
  const className = data.inv_year + ' ' + data.inv_make + ' ' + data.inv_model
  res.render("./inventory/details", {
    title: className,
    nav,
    grid,
  })
}

triggerError = async (req, res, next) => {
  try {
    throw new Error("Intentional server error triggered for testing.");
  } catch (err) {
    next(err);
  }
};

module.exports = {
  invCont,
  triggerError
}
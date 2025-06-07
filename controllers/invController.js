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
    errors: null
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
    errors: null
  })
}

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    classificationSelect,
    errors: null
  })
}

/* ***************************
 *  Build new classification view
 * ************************** */
invCont.buildNewClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null
  })
}

/* ****************************************
*  Process New Classification
* *************************************** */
invCont.addNewClassification = async function (req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const regResult = await invModel.addNewClassification(classification_name)

  if (regResult) {
    req.flash(
      "notice",
      `The ${classification_name} classification was successfully added.`
    )

    return res.redirect("/inv")
  } else {
    req.flash("notice", "Sorry, the registration failed.")

    return res.status(501).render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null
    })
  }
}

/* ***************************
 *  Build new vehicle view
 * ************************** */
invCont.buildNewVehicle = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    classificationList,
    errors: null
  })
}

/* ****************************************
*  Process New Vehicle
* *************************************** */
invCont.addNewVehicle = async function (req, res) {
  let nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList()
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body

  const regResult = await invModel.addNewVehicle(
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
  )

  if (regResult) {
    req.flash(
      "notice",
      `The ${inv_make} ${inv_model} was successfully added.`
    )
    return res.redirect("/inv")
  } else {
    req.flash("notice", "Sorry, the registration failed.")

    return res.status(501).render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      errors: null
    })
  }
}

invCont.triggerError = async (req, res, next) => {
  try {
    throw new Error("Intentional server error triggered for testing.");
  } catch (err) {
    next(err);
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

module.exports = invCont
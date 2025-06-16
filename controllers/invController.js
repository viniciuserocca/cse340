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
  const inv_id = req.params.invId
  const data = await invModel.getItemDetails(inv_id)
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
    req.flash("success",`The ${classification_name} classification was successfully added.`)
    req.session.save(() => {
    return res.redirect("/inv/")
    });
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
 *  Build new inventory view
 * ************************** */
invCont.buildNewInventory = async function (req, res, next) {
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
*  Process New Inventory
* *************************************** */
invCont.addNewInventory = async function (req, res) {
  let nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList()
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body

  const regResult = await invModel.addNewInventory(
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
    req.flash("success", `The ${inv_make} ${inv_model} was successfully added.`)
    req.session.save(() => {
    return res.redirect("/inv/")
    });
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

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.invId)
  let nav = await utilities.getNav()
  const itemData = await invModel.getItemDetails(inv_id)
  const classificationList = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationList: classificationList,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("success", `The ${itemName} was successfully updated.`)
    req.session.save(() => {
    return res.redirect("/inv/")
    });
  } else {
    const classificationList = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationList: classificationList,
    errors: null,
    inv_id,
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
    })
  }
}

/* ***************************
 *  Build delete inventory view
 * ************************** */
invCont.deleteInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.invId)
  let nav = await utilities.getNav()
  const itemData = await invModel.getItemDetails(inv_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  })
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_price,
    inv_year
  } = req.body
  const deleteResult = await invModel.deleteInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_price,
    inv_year
  )

  if (deleteResult) {
    req.flash("success", `The deletion was successful.`)
    req.session.save(() => {
    return res.redirect("/inv/")
    });
  } else {
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the deletion failed.")
    res.status(501).render("inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price,
    })
  }
}

/* ***************************
 *  Build manage classification view
 * ************************** */
invCont.buildManageClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationTable = await utilities.buildManageClassification()
  res.render("./inventory/manage-classification", {
    title: "Manage Classification",
    nav,
    classificationTable,
    errors: null
  })
}

/* ***************************
 *  Build edit classification view
 * ************************** */

invCont.editClassificationView = async function (req, res, next) {
  const classification_id = parseInt(req.params.classificationId)
  let nav = await utilities.getNav()
  const itemData = await invModel.getClassificationDetails(classification_id)
  res.render("./inventory/edit-classification", {
    title: "Edit Classification",
    nav,
    classification_name: itemData.classification_name,
    classification_id: itemData.classification_id,
    errors: null
  })
}

/* ***************************
 *  Build delete classification view
 * ************************** */

invCont.deleteClassificationView = async function (req, res, next) {
  const classification_id = parseInt(req.params.classificationId)
  let nav = await utilities.getNav()
  const itemData = await invModel.getClassificationDetails(classification_id)
  res.render("./inventory/delete-classification", {
    title: "Delete Classification",
    nav,
    classification_name: itemData.classification_name,
    classification_id: itemData.classification_id,
    errors: null
  })
}

/* ***************************
 *  Update Classification Data
 * ************************** */
invCont.updateClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    classification_name,
    classification_id
  } = req.body
  const updateResult = await invModel.updateClassification(
    classification_name,
    classification_id
  )

  if (updateResult) {
    req.flash("success", `The ${updateResult.classification_name} was successfully updated.`)
    req.session.save(() => {
    return res.redirect("/inv/manageClassification")
    });
  } else {
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-classification", {
    title: "Edit Classification",
    nav,
    errors: null,
    classification_name,
    classification_id
    })
  }
}

/* ***************************
 *  Delete Classification Data
 * ************************** */
invCont.deleteClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    classification_name,
    classification_id
  } = req.body
  const deleteResult = await invModel.deleteClassification(
    classification_id,
    classification_name
  )

  if (deleteResult) {
    req.flash("success", `The deletion was successful.`)
    req.session.save(() => {
    return res.redirect("/inv/manageClassification")
    });
  } else {
    req.flash("notice", "Sorry, the deletion failed.")
    res.status(501).render("inventory/delete-classification", {
    title: "Delete Classification",
    nav,
    errors: null,
    classification_name,
    classification_id
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

module.exports = invCont
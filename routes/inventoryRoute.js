// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const classificationValidation = require('../utilities/classification-validation')
const inventoryValidation = require('../utilities/inventory-validation')


/* ***************************
 *  Default GET
 * ************************** */
router.get(
  "/",
  utilities.checkLogin,
  utilities.checkPermission,
  utilities.handleErrors(invController.buildManagement)
);

/* ***************************
 *  Type GET
 * ************************** */
router.get(
  "/type/:classificationId", 
  utilities.handleErrors(invController.buildByClassificationId)
);

/* ***************************
 *  Detail GET
 * ************************** */
router.get(
  "/detail/:invId", 
  utilities.handleErrors(invController.buildItemDetails)
);

/* ***************************
 *  Inventory GET
 * ************************** */
router.get(
  "/getInventory/:classification_id", 
  utilities.handleErrors(invController.getInventoryJSON)
)

/* ***************************
 *  Trigger Error GET
 * ************************** */
router.get(
  "/trigger-error",
  utilities.handleErrors(invController.triggerError)
);

/* ***************************
 *  New Classification GET and POST
 * ************************** */
router.get(
  "/newClassification",
  utilities.checkLogin,
  utilities.checkPermission,
  utilities.handleErrors(invController.buildNewClassification)
);

router.post(
  "/newClassification",
  classificationValidation.classificationRules(),
  classificationValidation.checkClassificationData,
  utilities.checkLogin,
  utilities.checkPermission,
  utilities.handleErrors(invController.addNewClassification)
);

/* ***************************
 *  Manage Classification GET
 * ************************** */

router.get(
  "/manageClassification",
  utilities.checkLogin,
  utilities.checkPermission,
  utilities.handleErrors(invController.buildManageClassification)
)

/* ***************************
 *  Edit Classification GET and POST
 * ************************** */
router.get(
  "/editClassification/:classificationId",
  utilities.checkLogin,
  utilities.checkPermission,
  utilities.handleErrors(invController.editClassificationView)
);

router.post("/editClassification",
  utilities.checkLogin,
  utilities.checkPermission,
  classificationValidation.classificationRules(),
  classificationValidation.checkUpdateClassificationData,
  utilities.handleErrors(invController.updateClassification)
);

/* ***************************
 *  Delete Classification GET and POST
 * ************************** */
router.get(
  "/deleteClassification/:classificationId",
  utilities.checkLogin,
  utilities.checkPermission,
  utilities.handleErrors(invController.deleteClassificationView)
);

router.post("/deleteClassification",
  utilities.checkLogin,
  utilities.checkPermission,
  classificationValidation.classificationDeleteRules(),
  classificationValidation.checkDeleteClassificationData,
  utilities.handleErrors(invController.deleteClassification)
);

/* ***************************
 *  New Inventory GET and POST
 * ************************** */
router.get(
  "/newInventory",
  utilities.checkLogin,
  utilities.checkPermission,
  utilities.handleErrors(invController.buildNewInventory)
);

router.post(
  "/newInventory",
  inventoryValidation.inventoryRules(),
  inventoryValidation.checkInventoryData,
  utilities.checkLogin,
  utilities.checkPermission,
  utilities.handleErrors(invController.addNewInventory)
);

/* ***************************
 *  Edit Inventory GET and POST
 * ************************** */
router.get(
  "/edit/:invId",
  utilities.checkLogin,
  utilities.checkPermission,
  utilities.handleErrors(invController.editInventoryView)
);

router.post("/edit",
  utilities.checkLogin,
  utilities.checkPermission,
  inventoryValidation.inventoryRules(),
  inventoryValidation.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

/* ***************************
 *  Delete Inventory GET and POST
 * ************************** */
router.get(
  "/delete/:invId",
  utilities.checkLogin,
  utilities.checkPermission,
  utilities.handleErrors(invController.deleteInventoryView)
);

router.post("/delete",
  utilities.checkLogin,
  utilities.checkPermission,
  utilities.handleErrors(invController.deleteInventory)
);

module.exports = router;
// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const classificationValidation = require('../utilities/newClassification-validation')
const inventoryValidation = require('../utilities/newInventory-validation')

router.get(
  "/type/:classificationId", 
  utilities.handleErrors(invController.buildByClassificationId)
);

router.get(
  "/detail/:invId", 
  utilities.handleErrors(invController.buildItemDetails)
);

router.get(
  "/trigger-error",
  utilities.handleErrors(invController.triggerError)
);

router.get(
  "/",
  utilities.handleErrors(invController.buildManagement)
);

router.get(
  "/getInventory/:classification_id", 
  utilities.handleErrors(invController.getInventoryJSON)
)

// New Classification Route
router.get(
  "/newClassification",
  utilities.handleErrors(invController.buildNewClassification)
);

router.post(
  "/newClassification",
  classificationValidation.classificationRules(),
  classificationValidation.checkClassificationData,
  utilities.handleErrors(invController.addNewClassification)
);

// New Inventory Route
router.get(
  "/newInventory",
  utilities.handleErrors(invController.buildNewInventory)
);

router.post(
  "/newInventory",
  inventoryValidation.inventoryRules(),
  inventoryValidation.checkInventoryData,
  utilities.handleErrors(invController.addNewInventory)
);

// Edit Inventory Route
router.get(
  "/edit/:invId",
  utilities.handleErrors(invController.editInventoryView)
);

module.exports = router;
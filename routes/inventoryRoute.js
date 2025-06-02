// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const classificationValidation = require('../utilities/newClassification-validation')
const vehicleValidation = require('../utilities/newVehicle-validation')

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
  "/newClassification",
  utilities.handleErrors(invController.buildNewClassification)
);

router.post(
  "/newClassification",
  classificationValidation.classificationRules(),
  classificationValidation.checkClassificationData,
  utilities.handleErrors(invController.addNewClassification)
);

router.get(
  "/newVehicle",
  utilities.handleErrors(invController.buildNewVehicle)
);

router.post(
  "/newVehicle",
  vehicleValidation.inventoryRules(),
  vehicleValidation.checkInventoryData,
  utilities.handleErrors(invController.addNewVehicle)
);

module.exports = router;
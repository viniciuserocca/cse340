// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

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

module.exports = router;
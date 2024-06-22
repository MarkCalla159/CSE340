// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const classValidate = require("../utilities/inventory-validation")
// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
// Route to build vehicle's info
router.get("/detail/:detailId", invController.buildByDetailId);
// Route to errors
//router.get("/trigger-error", errorint.buildError);
//Route to build management
router.get("/",invController.buildManagementView);
//Route to get build add classification
router.get("/add-classification", invController.buildAddClassification);
//Process to add-classification
router.post("/add-classification",
    classValidate.addClassificationRules(),
    classValidate.checkAddClassificationData,
    utilities.handleErrors(invController.processClassification)
)
//Route to get build add classification
router.get("/add-inventory", invController.buildAddInventory)
//Process to add new inventory
router.post("/add-inventory",
    classValidate.addInventoryRules(),
    classValidate.checkAddInventoryData,
    utilities.handleErrors(invController.processNewInventory)
)
module.exports = router;
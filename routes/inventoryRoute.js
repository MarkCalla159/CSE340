// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const classValidate = require("../utilities/inventory-validation")

//Route to build management
router.get("/",
    utilities.checkStatus,
    utilities.handleErrors(invController.buildManagementView));
// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
// Route to build vehicle's info
router.get("/detail/:detailId", invController.buildByDetailId);
//Route to edit by Inventory ID
router.get("/edit/:inv_id",
    utilities.checkStatus,
    utilities.handleErrors(invController.buildEditInv));
//Post update
router.post("/update",
    classValidate.addInventoryRules(),
    classValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
);
//Route to delete info
router.get("/delete/:inv_id", 
    utilities.checkStatus,
    utilities.handleErrors(invController.buildDelete));
//Process to delete
router.post("/delete-invt"), utilities.handleErrors(invController.processDelete);

// Route to errors
router.get("/error/", invController.buildError);
//Route to get build add classification
router.get("/add-classification", 
    utilities.checkStatus,
    invController.buildAddClassification);
//Management select view
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))
//Process to add-classification
router.post("/add-classification",
    classValidate.addClassificationRules(),
    classValidate.checkAddClassificationData,
    utilities.handleErrors(invController.processClassification)
)
//Route to get build add classification
router.get("/add-inventory",
    utilities.checkStatus,
    invController.buildAddInventory)
//Process to add new inventory
router.post("/add-inventory",
    classValidate.addInventoryRules(),
    classValidate.checkAddInventoryData,
    utilities.handleErrors(invController.processNewInventory)
)
module.exports = router;
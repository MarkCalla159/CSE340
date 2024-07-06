const utilities = require(".")
  const { body, validationResult } = require("express-validator")
  const validate = {}
  const inventoryModel = require("../models/inventory-model")
/*  **********************************
  * Classification Data Validation Rules
  * ********************************* */
 validate.addClassificationRules = () => {
    return [
        body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Please provide a valid Classification Name")
    ]
 }
/*  **********************************
  *  Check data and return errors or continue to add classification
  * ********************************* */
 validate.checkAddClassificationData = async (req, res, next) => {
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
        return;
    }
    next()
 }
 /*  **********************************
  *  Inventory Data Validation Rules
  * ********************************* */
 validate.addInventoryRules = () => {
    return [
        //not sure how it works but works for classification_id
        body("classification_id")
        .trim()
        .escape()
        .isNumeric()
        .isLength({ min:1 })
        .withMessage("Please provide the classification."),

        //this part to infinity and beyond is for characteristics
        body("inv_make")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Please provide the vehicle make."),

        body("inv_model")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Please provide the vehicle model."),

        body("inv_description")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 10 })
        .withMessage("Please provide the vehicle's description."),

        body("inv_price")
        .trim()
        .escape()
        .notEmpty()
        .isNumeric()
        .isLength({ min: 3 })
        .withMessage("Please provide a price."),

        body("inv_year")
        .trim()
        .escape()
        .notEmpty()
        .isNumeric()
        .isLength({ min:4, max: 4 })
        .withMessage("Please provide a valid year."),

        body("inv_miles")
        .trim()
        .escape()
        .notEmpty()
        .isNumeric()
        .isLength({ min: 1 })
        .withMessage("Please provide the mileage."),

        body("inv_miles")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Please provide the color."),
    ]
 }

 /*  **********************************
  *  Check data and return errors or continue to add inventory
  * ********************************* */
 validate.checkAddInventoryData = async (req, res, next) => {
    const {classification_id, 
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let classificationNav = await utilities.buildClassificationList();
        res.render("inventory/add-inventory" , {
            errors,
            title: "Vehicle Management",
            nav,
            classificationNav,
            classification_id, 
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color
        })
        return;
    }
    next()
 }
/*  **********************************
  *  Check data and return errors or continue to add inventory
  * ********************************* */
validate.checkUpdateData = async (req, res, next) => {
    const {inv_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let classificationNav = await utilities.buildClassificationList();
        res.render("inventory/edit-inventory" , {
            errors,
            title: "Edit" + inv_make + " " + inv_model,
            nav,
            classificationNav,
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
            classification_id,
        })
        return;
    }
    next()
 }
 module.exports = validate
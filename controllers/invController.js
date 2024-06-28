const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};
const errorint = {};
/* **************************************** *
 *  Build inventory by classification view  *
 * **************************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};
/* **************************************** *
 *  Build inventory by single vehicle view  *
 * **************************************** */
invCont.buildByDetailId = async function (req, res, next) {
  const detail_id = req.params.detailId;
  const data = await invModel.getVehicleByDetId(detail_id);
  const grid = await utilities.buildVehicleDet(data);
  let nav = await utilities.getNav();
  const vehicleInfo =
    data[0].inv_year + " " + data[0].inv_make + " " + data[0].inv_model;
  res.render("./inventory/views", {
    title: vehicleInfo,
    nav,
    grid,
  });
};
/* **************************************** *
 *  Build error  *
 * **************************************** */
invCont.buildError = async function (req, res, next) {
  const error500 = new Error();
  error500.status = 500;
  error500.message = "I am running away from my responsibilities. And it feels good";
  next(error500);
};

/* ***************************
 *  Build inventory management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav();
  try {
    res.render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Build Add Classification
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  try {
    res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Process Add Classification
 * ************************** */
invCont.processClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  const { classification_name } = req.body;
  const classResult = await invModel.addNewClassification(classification_name);
  if (classResult) {
    req.flash(
      "notice",
      `Congratulations, you added the: ${classification_name} classification.`
    );
    let nav = await utilities.getNav();
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the new classification failed");
    res.status(501).render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
    });
  }
};
/* ***************************
 *  Build Add Inventory
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  try {
    let classificationNav = await utilities.buildClassificationList();
    res.render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationNav,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};
/* ***************************
 *  Process Add Inventory
 * ************************** */
invCont.processNewInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
  } = req.body;

  const addResult = await invModel.addNewInventory(
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
  );

  const classificationNav = await utilities.buildClassificationList();

  if (addResult) {
    req.flash(
      "notice",
      `Congratulations, you added the: ${
        inv_make + " " + inv_model
      } classification.`
    );
    let nav = await utilities.getNav();
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      classificationNav,
      messages: req.flash("notice"),
      errors: null,
    });
  } else {
    req.flash("notice", `Sorry, the new vehicle could not be added`);
    res.status(501).render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationNav,
      errors: null,
    });
  }
};
module.exports = invCont;

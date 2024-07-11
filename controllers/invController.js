const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};
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
 *  Build error
 * **************************************** */
invCont.buildError = (req, res, next) => {
  const error500 = new Error();
  error500.status = 500;
  error500.message =
    "I am running away from my responsibilities. And it feels good";
  next(error500);
  //throw new Error("Intentional error occurred");
};

/* ***************************
 *  Build inventory management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classificationNav = await utilities.buildClassificationList();
  try {
    res.render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      classificationNav,
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
    let classificationNav = await utilities.buildClassificationList();
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      classificationNav,
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
/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};
/* ***************************
 *  Build Edit Inventory ID
 * ************************** */
invCont.buildEditInv = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const data = await invModel.getVehicleByDetId(inv_id);
  const itemData = data[0];
  const classificationSelect = await utilities.buildClassificationList(
    itemData.classification_id
  );
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
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
    classification_id: itemData.classification_id,
  });
};
/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
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
  } = req.body;
  
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
  );

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model;
    req.flash("notice", `The ${itemName} was successfully updated.`);
    res.redirect("/inv/");
  } else {
    const classificationSelect = await utilities.buildClassificationList(
      classification_id
    );
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the insert failed.");
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
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
      classification_id,
    });
  }
};
/* ***************************
 *  Build Delete View
 * ************************** */
invCont.buildDelete = async function (req, res, next){
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const data = await invModel.getVehicleByDetId(inv_id)
  const itemData = data[0];
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
    errors:null,
  })
};
/* ***************************
 *  Process Delete Inventory
 * ***************************/
invCont.processDelete = async function (req, res, next){
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price,
  } = req.body
  const deleteResult = await invModel.processDelete(inv_id)
   if(deleteResult) {
    req.flash(
      "alert success"
      `${inv_year} ${inv_make} ${inv_model} successfully deleted.`
    )
    res.redirect("/inv/")
   }else {
    req.flash("alert error", "Sorry, the vehicle was not deleted.")
    res.redirect("/inv/delete/" + inv_id)
  }
}
module.exports = invCont;

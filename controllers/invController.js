const invModel = require("../models/inventory-model");
const revModel = require("../models/review-model");
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
invCont.buildDelete = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const data = await invModel.getVehicleByDetId(inv_id);
  const itemData = data[0];
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
    errors: null,
  });
};
/* ***************************
 *  Process Delete Inventory
 * ***************************/
invCont.processDelete = async function (req, res, next) {
  let nav = await utilities.getNav();
  const { inv_id, inv_make, inv_model, inv_year, inv_price } = req.body;
  const deleteResult = await invModel.processDelete(inv_id);
  if (deleteResult) {
    req.flash(
      "alert success",`${inv_year} ${inv_make} ${inv_model} successfully deleted.`
    );
    res.redirect("/inv/");
  } else {
    req.flash("alert error", "Sorry, the vehicle was not deleted.");
    res.redirect("/inv/delete/" + inv_id);
  }
};
/* ***************************
 *  Build Review View (is it a rhyme?)
 * **************************/
invCont.buildAddReview = async function (req, res, next){
  try{
    const nav = await utilities.getNav();
    const {
      account_id,
      inv_id
    } = req.params
    //req.body
    res.render("./inventory/views",{
      nav,
      account_id,
      inv_id, 
      errors: null
    })
  }catch (error) {
    next(error);
  }
} 
/* ***************************
 *  Process Add Review (it is not a rhyme)
 * ************************** */
invCont.addReview = async function (req, res, next) {
  let nav = await utilities.getNav();
  try {
    //console.log("Entrando a addReview");
    let nav = await utilities.getNav();
    const { review_text, account_id, inv_id } = req.body;
    const review_date = new Date();
    const review = await revModel.addNewReview(
      parseInt(account_id),
      parseInt(inv_id),
      review_text,
      review_date
    );
    
    if(review) {
      req.flash("notice", "Review Added Correctly");
      const grid = await utilities.buildReview(review);
      res.status(201).render("./inventory/add-review", {
        title: "Current Review",
        nav,
        grid,
        errors: null,
      });
    } else {
      req.flash("notice", "Sorry, We can upload your review")
      res.status(501).render("/", {
        nav,
        errors: null,
      })
    }
  } catch (error) {
    //console.error("Error en addReview:", error);
    next(error);
  }
};
/* ***************************
 *  Build Review View (is it a rhyme?)
 * ***************************/
invCont.buildReview = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    const review_id = parseInt(req.params.review_id, 10);
    const {
      account_id,
      inv_id
    } = req.params
    /*if (isNaN(review_id)) {
      req.flash("error", "Invalid review ID.");
      return res.status(400).redirect("/");
    }
    const data = await revModel.getReviewId(review_id);
    const grid = await utilities.buildReview(data);*/

    res.render("inventory/add-review", {
      title: "Current Review",
      nav,
      grid,
      review_id,
      account_id,
      inv_id,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
}; 
/* ***************************
 *  Build Edit Review View (is it a rhyme? again?)
 * ***************************/
invCont.buildEditRev = async function (req, res, next) {
  try{
    const nav = await utilities.getNav();
    const {review_id} = req.params
    const data = await revModel.getReviewId(review_id)
    const rev = await invModel.getVehicleByDetId(inv_id)
    const itemData = rev[0]
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
    res.render("inventory/edit-review", {
      title: "Edit Review " + itemName,
      nav,
      review_id: data.review_id,
      review_text: data.review_text,
      errors: null,
    })
  } catch (error){
    next (error)
  }
}
/* ***************************
 *  Process Edit Review View (is it a rhyme? again?)
 * ***************************/
invCont.editReview = async function (req, res, next){
  try{
    let nav = await utilities.getNav();
    const {
      review_id,
      review_text
    } = req.body
    const review_date = new Date()

    const edit = await revModel.editReview(review_id, review_text, review_date)
    if (edit) {
      const allrev = await utilities.allReviews(edit.account_id)
      
      const rev = await invModel.getVehicleByDetId(inv_id)
      const itemData = rev[0]
      const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
      req.flash("notice", "Your edition was successfully updated")
      res.status(201).render("inventory/acc-review", {
        title: "All My Reviews",
        nav,
        account_id: edit.account_id,
        allrev
      })
    } else {
      req.flash("notice", "Sorry, the edit failed.");
      res.status(501).render("inventory/edit-review", {
        title: "Edit Review " + itemName,
        nav,
        review_id,
        review_text,
        errors: null,
      })
    }
  } catch (error){
    next (error)
  }
}
/* ***************************
 *  Build Delete Review View (is it a rhyme? this is pointless)
 * ***************************/
invCont.buildDeleteRev = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    const review_id = req.params
    const data = await revModel.getReviewId(review_id)
    
    const rev = await utilities.buildReview(data)

    res.render("./inventory/delete-review", {
      title: "Delete Review",
      nav,
      review_id,
      rev,
      errors: null,
    })
  } catch (error) {
    next(error);
  }
};
/* ***************************
 *  Process Delete Review View 
 *(nothing is working, well actually 
 * I dont know, cuz add review have some query error)
 * ***************************/
invCont.processDelRev = async function (req, res, next) {
  try {
    const { review_id, account_id } = req.bdoy;
    const deleteRev = await revModel.deleteRev(review_id);
    let nav = await utilities.getNav();

    if (deleteRev) {
      req.flash("alert success", `The review wassuccessfully deleted.`);
      res.redirect("/inventory/acc-review");
    } else {
      req.flash("alert error", "Sorry, the review was not deleted.");
      res.status(501).render("/inventory/delete-review", {
        title: "Delete Review",
        nav,
        review_id,
        account_id,
        errors: null,
      });
    }
  } catch (error) {
    next(error);
  }
};
module.exports = invCont;

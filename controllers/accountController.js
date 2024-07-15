const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  //req.flash("notice", "This is a flash message.");
  res.render("account/login", {
    title: "Login",
    nav,
    messages: req.flash(),
    errors: null,
  });
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  //req.flash("notice", "This is a flash message.");
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;
  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    //account_password,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }
}
/* ****************************************
 *  Deliver account view
 * *************************************** */
async function buildAccManagement(req, res) {
  let nav = await utilities.getNav();
  //req.flash("notice", "This is a flash message.");
  //const classificationSelect = await utilities.buildClassificationList();
  //if (res.locals.loggedin == 1) {
    res.render("account/account-management", {
      title: "Account Management",
      nav,
      //classificationSelect,
      errors: null,
    });
  //} else {
   // res.render("account/login", {
    //  title: "Login",
    //  nav,
     // errors: null,
    //});
  //}
}
/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res, next) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 }
      );
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }
      return res.redirect("/account/");
    }
  } catch (error) {
    return new Error("Access Forbidden");
  }
}
/* ****************************************
 *  Process login request
 * ************************************ */
async function buildLogout(req, res){
  res.clearCookie("jwt")
  res.redirect("/")
}
/* ****************************************
 *  Deliver Update account view
 * ***************************************/
async function updateAccInfo(req, res, next) {
    let nav = await utilities.getNav();
    const account_id = req.params.account_id;
    const data = await accountModel.getAccountById(account_id);
    const accData = data[0];
    const accName = `${accData.account_firstname}`
    res.render("./account/update-account", {
      title: "Update " + accName + "'s Account",
      nav,
      account_firstname: accData.account_firstname,
      account_lastname: accData.account_lastname,
      account_email: accData.account_email,
      errors: null,
    });
}
/* ****************************************
 *  Process update info request
 * ************************************ */
async function updateInfo(req, res, next) {
  let nav = await utilities.getNav();
  const account_id = res.locals.accountData.account_id;
  const { account_firstname, account_lastname, account_email } = req.body;
  const updateData = await accountModel.updateAccoInfo(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  );
  if (updateData) {
    const accName = `${account_firstname}` + " " + `${account_lastname}`
    req.flash("notice", `${accName} your General Info was successfully update, please Logout to see the changes.`);
    //res.clearCookie("jwt")
    res.redirect("/account/");
    //const updateData = await accountModel.getAccountById(account_id)
    const accessToken = jwt.sign(
      updateData,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: 3600 * 1000 }
  );
  res.cookie('jwt', accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
  res.status(201).redirect('/account/');
  } else {
    const accName = `${account_firstname}  ${account_lastname}`;
    req.flash(
      "notice",
      "My apologies, you are not able to update your General Info"
    );
    res.status(501).render("/account/update-account", {
      title: "Update " + accName + "'s Account",
      nav,
      errors: null,
    });
  }
}
/* ****************************************
 *  Process update info request
 * ************************************ */
async function updatePassword(req, res, next){
  let nav = await utilities.getNav();
  const {
    account_password
  } =req.body;
  const account_id = res.locals.accountData.account_id;

  const hashedPassword = bcrypt.hashSync(account_password, 10);
  const updatePassword = await accountModel.updatePass(account_id, hashedPassword);
  
  if (updatePassword) {
    req.flash("notice", " Your password was changed")
    res.status(201).render("account/account-management",{
      title: "Account Management",
      nav,
      errors: null
    })
  } else {
    req.flash("notice", "Sorry something went wrong and your password were not update")
    req.status(501).render("account/update-account",{
      title: "Update " + accName + "'s Account",
      nav,
      account_firstname: res.locals.accountData.account_firstname,
      account_lastname: res.locals.accountData.account_lastname,
      account_email: res.locals.accountData.account_email
    })
  }
}
module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccManagement,
  buildLogout,
  updateAccInfo,
  updateInfo,
  updatePassword
};

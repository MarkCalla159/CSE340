const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/index")
const regValidate = require('../utilities/account-validation')

//Route to build login management view
router.get("/", 
    utilities.checkLogin, 
    utilities.handleErrors(accountController.buildAccManagement))
//router.get("/login",accountController.buildLogin);

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))
//Route to logout account
router.get("/logout", utilities.handleErrors(accountController.buildLogout))
// Route to build register view
router.get("/register", utilities.handleErrors(accountController.buildRegister))
// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)
// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
)
//router.get("/update-ginfo",
   // utilities.checkLogin, 
   // utilities.handleErrors(accountController.updateInfo)
//)
//Route to edit info by account ID
router.get("/update-account/:account_id", utilities.handleErrors(accountController.updateAccInfo))
//Process the update general info account
router.post(
    "/update-ginfo",
    regValidate.registationRules(),
    utilities.handleErrors(accountController.updateInfo)
)
router.post(
    "/update-password",
    regValidate.passRules(),
    utilities.handleErrors(accountController.updatePassword)
)
module.exports = router;
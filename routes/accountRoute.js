const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/index")
const regValidate = require('../utilities/account-validation')

//Route to build login
//router.get("/login",accountController.buildLogin);
// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))
// Route to build register view
router.get("/register", utilities.handleErrors(accountController.buildRegister))
//Route to build account view
router.get(
    "/",
    utilities.checkLogin,
    utilities.handleErrors(accountController.buildManagement)
)
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
module.exports = router;
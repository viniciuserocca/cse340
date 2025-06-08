// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')


/* ***************************
 *  Default GET
 * ************************** */
router.get("/", 
  utilities.checkLogin, 
  utilities.handleErrors(accountController.buildAccountManagement)
);

/* ***************************
 *  Login GET and POST
 * ************************** */
router.get("/login", 
  utilities.handleErrors(accountController.buildLogin)
);

router.post("/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

/* ***************************
 *  Logout GET
 * ************************** */
router.get("/logout", 
  utilities.handleErrors(accountController.accountLogout)
);

/* ***************************
 *  Register GET and POST
 * ************************** */
router.get("/register", 
  utilities.handleErrors(accountController.buildRegister)
);

router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

/* ***************************
 *  Update GET and POST
 * ************************** */
router.get("/update/:accountId", 
  utilities.handleErrors(accountController.buildAccountUpdate)
);

router.post("/update/:accountId",
  regValidate.updateInfoRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccountInfo)
);

router.post("/password",
  regValidate.updatePasswordRules(),
  regValidate.checkUpdatePassword,
  utilities.handleErrors(accountController.updateAccountPassword)
);

module.exports = router;
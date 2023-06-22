// packages
const express = require("express");
const router = express.Router();

// middlewares
const { authentication } = require('../common/middlewares');


//controllers
const { contactUsController } = require('../controller/contactUs.controller.js');
const { registerUser } = require("../controller/authentication/register.controller");
const { forgotPassword, resetPassword } = require('../controller/authentication/forgotPwd.controller');
const { userLogin } = require('../controller/authentication/login.controller');
const { userLogout } = require('../controller/authentication/logout.controller');
const { carouselsList, vendorList } = require('../controller/advertisements.controller');
const { subscribeToNewsletter } = require('../controller/subscribe.controller');
const { regerateToken } = require('../controller/regenerate.controller');

// For get user details and store to db 
router.post('/register', registerUser);

// For get user details , sign to JWT token and login
router.post('/login', userLogin);

// For user to logout
router.get('/logout', userLogout);

// For send vendor details
router.get("/vendors", vendorList);

// For get email and save to db for update notification
router.post("/subscribe", subscribeToNewsletter);

// For send advertisement details
router.get("/advertisements", carouselsList);

// For regenerate token on post request
router.post('/generate-token', authentication, regerateToken);

// For get email to send otp on email
router.post('/forgot', forgotPassword);

// For get details for reset password , verify and update password into db
router.post('/reset', resetPassword);

// For get user details & message and store to db
router.post('/contact-us', contactUsController);

module.exports = router;
4
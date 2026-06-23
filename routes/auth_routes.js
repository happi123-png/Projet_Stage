const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth_controller');

const validate = require('../middlewares/validate');
const rateLimiter = require('../middlewares/limitetentative');
const verifyToken = require('../middlewares/verifierToken');

const {
    signupSchematotal,
    loginWebSchema,
    loginMobileSchema,
    loginAdminSchema,
    requestOtpWebSchema,
    requestOtpMobileSchema,
    verifyOtpWebSchema,
    verifyOtpMobileSchema,
    refreshSchema,
    logoutSchema
} = require('../validation/valider');

router.get('/me', verifyToken, authController.getMe);
router.post('/refresh/token', validate(refreshSchema), authController.refreshToken)
router.post('/logout', validate(logoutSchema), authController.logout)

router.post('/signup', validate(signupSchematotal), authController.signup);
router.post('/login/web', validate(loginWebSchema), authController.loginWeb);
router.post('/login/mobile', validate(loginMobileSchema), authController.loginMobile);

router.post('/otp/request/web', validate(requestOtpWebSchema), authController.requestOtpWeb);
router.post('/otp/request/mobile', validate(requestOtpMobileSchema), authController.requestOtpMobile);
router.post('/otp/verify/web', validate(verifyOtpWebSchema), authController.verifyOtpWeb);
router.post('/otp/verify/mobile', validate(verifyOtpMobileSchema), authController.verifyOtpMobile);

module.exports = router;
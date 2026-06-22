const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');

// Importation des middlewares
const validate = require('../middlewares/validate');
const rateLimiter = require('../middlewares/rateLimiter'); // Si tu as configuré un limiteur
const verifyToken = require('../middlewares/verifyToken'); // Pour getMe ou logout

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


router.post('/signup', validate(signupSchematotal), authController.signup);

router.post('/login/web', validate(loginWebSchema), authController.loginWeb);

router.post('/login/mobile', validate(loginMobileSchema), authController.loginMobile);

// 4. Connexion Administration
/*router.post('/login/admin', validate(loginAdminSchema), authController.loginAdmin);

// ─────────────────────────────────────────
// ROUTES OTP (Demande & Vérification)
// ─────────────────────────────────────────

// 5. Demande / Renvoyer OTP - Web
router.post('/otp/request/web', validate(requestOtpWebSchema), authController.requestOtp);

// 6. Demande / Renvoyer OTP - Mobile
router.post('/otp/request/mobile', validate(requestOtpMobileSchema), authController.requestOtp);

// 7. Vérification OTP - Web
router.post('/otp/verify/web', validate(verifyOtpWebSchema), authController.verifyOtp);

// 8. Vérification OTP - Mobile
router.post('/otp/verify/mobile', validate(verifyOtpMobileSchema), authController.verifyOtp);

// ─────────────────────────────────────────
// GESTION DES SESSIONS (Tokens & Profil)
// ─────────────────────────────────────────

// 9. Rafraîchir l'Access Token (Refresh Token)
router.post('/refresh', validate(refreshSchema), authController.refresh);

// 10. Déconnexion (Révocation du Refresh Token)
router.post('/logout', validate(logoutSchema), authController.logout);

// 11. Obtenir son profil (Route protégée par Bearer Token)
router.get('/me', verifyToken, authController.getMe);*/

module.exports = router;
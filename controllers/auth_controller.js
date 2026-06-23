const bcrypt = require('bcrypt');
const db = require('../models');
const sequelize = db.sequelize; // 
const jwt = require('jsonwebtoken')

const userService = require('../services/user_service');
const clientService = require('../services/client_service');
const adminService = require('../services/administrateur_service');
const profService = require('../services/professionnel_service');
const otpService = require('../services/otp');
const mailService = require('../services/email');
const smsService = require('../services/sms');
const tokenService = require('../services/token');
const RefreshToken = require('../models/refreshToken');


function normaliserTelephone(tel) {
    if (!tel) return null;
    let cleanTel = tel.replace(/[\s.-]/g, '');
    if (cleanTel.startsWith('+237')) return cleanTel;
    if (cleanTel.startsWith('237') && cleanTel.length === 12) return '+' + cleanTel;
    if (cleanTel.length === 9) return '+237' + cleanTel;
    return cleanTel;
}

async function getMe(req, res) {
    res.status(200).json({ message: 'Profil', user: req.user });
}

async function signup(req, res) {
    const t = await sequelize.transaction();
    try {
        const {
            username,
            email,
            telephone,
            genre,
            password,
            type_utilisateur,
            type_professionnel,
            codeParrain
        } = req.body;

        if (!username || !email || !telephone || !genre || !password || !type_utilisateur) {
            await t.rollback();
            return res.status(400).json({ message: 'Donnée manquante' });
        }

        if (type_utilisateur === 'PROFESSIONNEL' && !type_professionnel) {
            await t.rollback();
            return res.status(400).json({ message: 'Veuillez cocher COIFFEUR_INDEPENDANT ou SALON' });
        }

        const existantParEmail = await userService.trouverParEmail(email);
        if (existantParEmail) {
            await t.rollback();
            return res.status(400).json({ message: 'Email déjà utilisé' });
        }

        const existantParTel = await userService.trouverParTel(telephone);
        if (existantParTel) {
            await t.rollback();
            return res.status(400).json({ message: 'Numéro de téléphone déjà utilisé' });
        }

        // 3. Hachage du mot de passe
        const password_hash = await bcrypt.hash(password, 10);

        const user = await userService.creerUtilisateur({
            username,
            email,
            telephone,
            genre,
            password_hash,
            type_utilisateur
        }, t);

        if (type_utilisateur === 'CLIENT') {
            const parrain = (codeParrain && codeParrain.trim() !== "") ? codeParrain.trim() : null;

            await clientService.creerClient({
                utilisateur_id: user.id,
                nom: null,
                prenom: null,
                codeParrain: parrain
            }, t);

        } else if (type_utilisateur === 'PROFESSIONNEL') {
            await profService.creerProfessionnel({
                utilisateur_id: user.id,
                type_professionnel: type_professionnel,
                nom_usage: username
            }, t);
        }

        await t.commit();

        const code = await otpService.creerOtp(user.id, 'email', email);
        await mailService.envoyerOtp(email, code, user.username);

        return res.status(201).json({
            message: `Utilisateur créé avec succès ! Code OTP envoyé sur l'email ${user.email}`,
            ...(process.env.NODE_ENV !== 'production' && { debug_otp: code })
        });

    } catch (error) {
        if (!t.finished) await t.rollback();
        console.error('[ERREUR SIGNUP] :', error);
        res.status(500).json({ message: "Erreur serveur lors de l'inscription" });
    }
}

async function loginWeb(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Donnée manquante' });

        const user = await userService.trouverParEmail(email);
        if (!user) return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        const pass = await bcrypt.compare(password, user.password_hash);
        if (!pass) return res.status(401).json({ message: 'Email ou mot de passe incorrect' });

        const code = await otpService.creerOtp(user.id, 'email', email);
        await mailService.envoyerOtp(email, code, user.username);

        res.status(200).json({
            message: `Code otp envoyé sur l'email ${user.email}, ce code expire dans 5 minutes`
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Erreur lors de la connexion par email' });
    }
}

async function loginMobile(req, res) {
    try {
        const { telephone, password } = req.body;
        if (!telephone || !password) return res.status(400).json({ message: 'Donnée invalide' });
        const user = await userService.trouverParTel(telephone);
        if (!user) return res.status(401).json({ message: 'Numéro de téléphone ou mot de passe incorrect' });
        const compare = await bcrypt.compare(password, user.password_hash);
        if (!compare) return res.status(401).json({ message: 'Numéro de téléphone ou mot de passe incorrect' });

        const telCle = normaliserTelephone(telephone);
        const code = await otpService.creerOtp(user.id, 'sms', telCle);
        await smsService.envoyerOtp(telCle, code);

        res.status(200).json({ message: `Code otp envoyé au numéro ${user.telephone}, ce code expire dans 5 minutes`, codeOtp: code });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Erreur lors de la connexion via le mobile' });
    }
}

async function requestOtpWeb(req, res) {
    try {
        const { email } = req.body
        if (!email) return res.status(400).json({ message: 'Email manquant' })
        const user = await userService.trouverParEmail(email)
        if (!user) return res.status(404).json({ message: 'Email non enregistré' })

        const code = await otpService.creerOtp(user.id, 'email', email);
        await mailService.envoyerOtp(email, code, user.username);

        res.status(200).json({
            message: `Code otp envoyé sur l'email ${user.email}, ce code expire dans 5 minutes`
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Erreur lors de la demande d\' otp par web'
        })
    }
}

async function requestOtpMobile(req, res) {
    try {
        const { telephone } = req.body
        if (!telephone) return res.status(400).json({ message: 'Donnée invalide' })
        const user = await userService.trouverParTel(telephone)
        if (!user) return res.status(404).json({ message: 'Numero de telephone non enregistrer' })
        const telCle = normaliserTelephone(telephone);
        const code = await otpService.creerOtp(user.id, 'sms', telCle);
        await smsService.envoyerOtp(telCle, code);
        res.status(200).json({
            message: `Code otp envoyé au numero de telephone ${user.email}, ce code expire dans 5 minutes`,
            codeOtp: code
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Erreur lors de la demande d\' otp par sms'
        })
    }
}

async function verifyOtpWeb(req, res) {
    try {
        const { email, code } = req.body
        if (!email || !code) return res.status(400).json({ message: 'Donnée manquant' })

        const user = await userService.trouverParEmail(email)
        if (!user) return res.status(404).json({ message: 'Utilisateur non repertorier' })

        const verifie = await otpService.verifierOtp(user.id, code)
        if (!verifie.valide) {
            return res.status(401).json({
                message: verifie.message
            });
        }
        const token = await tokenService.genererAccessToken(user.id)
        const userResponse = user.toJSON();
        delete userResponse.password_hash;
        res.status(200).json({
            message: `Heureux de vous retrouver Mr / Mne ${user.username}.`,
            Utilisateur: userResponse,
            token: token
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Erreur lors de la verification d\' otp par web'
        })
    }
}

async function verifyOtpMobile(req, res) {
    try {
        const { telephone, code } = req.body
        if (!telephone || !code) return res.status(400).json({ message: 'Donnée invalide' })
        const user = await userService.trouverParTel(telephone)
        if (!user) return res.status(404).json({ message: 'Numero de telephone non enregistrer' })
        const verifier = await otpService.verifierOtp(user.id, code)
        if (!verifier.valide) {
            return res.status(401).json({
                message: verifier.message
            });
        }
        const token = await tokenService.genererAccessToken(user.id)
        const userResponse = user.toJSON();
        delete userResponse.password_hash;
        res.status(200).json({
            message: `Heureux de vous retrouver Mr / Mne ${user.username}.`,
            Utilisateur: userResponse,
            token: token
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Erreur lors de la verification d\' otp par mobile'
        })
    }
}

async function refreshToken(req, res) {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ message: "Refresh token manquant." });
        }

        const tokenStocke = await RefreshToken.findOne({ where: { token_hash: refreshToken } });
        if (!tokenStocke) {
            return res.status(403).json({ message: "Refresh token invalide ou révoqué." });
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async(err, decoded) => {
            if (err) {
                await RefreshToken.destroy({ where: { token_hash: refreshToken } });
                return res.status(401).json({ message: "Refresh token expiré ou corrompu." });
            }

            const utilisateur = await Utilisateur.findByPk(decoded.id);
            if (!utilisateur) {
                return res.status(404).json({ message: "Utilisateur introuvable." });
            }

            const accessToken = jwt.sign({
                    id: utilisateur.id,
                    email: utilisateur.email,
                    type_utilisateur: utilisateur.type_utilisateur
                },
                process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' }
            );

            return res.status(200).json({ accessToken });
        });

    } catch (error) {
        console.error("Erreur lors du refresh token :", error);
        return res.status(500).json({ message: "Erreur interne du serveur." });
    }
}

async function logout(req, res) {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ message: "Refresh token manquant." });
        }
        const nbrSupprime = await RefreshToken.destroy({ where: { token_hash: refreshToken } });

        if (nbrSupprime === 0) {
            return res.status(404).json({ message: "Token introuvable ou déjà révoqué." });
        }

        return res.status(200).json({ message: "Déconnexion réussie et session révoquée." });

    } catch (error) {
        console.error("Erreur lors de la déconnexion :", error);
        return res.status(500).json({ message: "Erreur interne du serveur." });
    }
}

module.exports = {
    getMe,
    signup,
    loginWeb,
    loginMobile,
    verifyOtpWeb,
    requestOtpWeb,
    verifyOtpMobile,
    requestOtpMobile,
    refreshToken,
    logout
};
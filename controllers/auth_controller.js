const bcrypt = require('bcrypt');
const userService = require('../services/user_service');
const otpService = require('../services/otp');
const mailService = require('../services/email');
const smsService = require('../services/sms');
const tokenService = require('../services/token');

function normaliserTelephone(tel) {
    if (!tel) return null;
    let cleanTel = tel.replace(/[\s.-]/g, ''); // Enlever les espaces ou tirets cachés
    if (cleanTel.startsWith('+237')) return cleanTel;
    if (cleanTel.startsWith('237') && cleanTel.length === 12) return '+' + cleanTel;
    if (cleanTel.length === 9) return '+237' + cleanTel;
    return cleanTel;
}

async function getMe(req, res) {
    res.status(200).json({ message: 'Profil', user: req.user })
}

async function signup(req, res) {
    try {
        const { username, email, telephone, genre, password, type_utilisateur } = req.body;
        const existantParEmail = await userService.trouverParEmail(email)

        if (!username || !email || !telephone || !genre || !password || !type_utilisateur) {
            return res.status(400).json({ message: 'Donnée manquante' })
        }
        if (existantParEmail) return res.status(400).json({
            message: 'Email déjà utilisé'
        })
        const existantParTel = await userService.trouverParTel(telephone)
        if (existantParTel) return res.status(400).json({ message: 'Numero de telephone deja utilise' })

        const password_hash = await bcrypt.hash(password, 10)

        const user = await userService.creerUtilisateur({
            username,
            email,
            telephone,
            genre,
            password_hash,
            type_utilisateur
        })
        const code = await otpService.creerOtp(user.id, 'email', email)
        const resultat = await mailService.envoyerOtp(email, code, user.username)

        return res.status(201).json({
            message: `Utilisateur créé avec succès ! Code OTP envoyé sur l'email ${user.email}`,
            ...(process.env.NODE_ENV !== 'production' && { debug_otp: code })
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Erreur serveur lors de l\'inscription'
        })
    }

}

async function loginWeb(req, res) {
    try {
        const { email, password } = req.body
        if (!email || !password) return res.status(400).json({ message: 'Donnée manquante' })

        const user = await userService.trouverParEmail(email)
        if (!user) return res.status(401).json({ message: 'Email ou mot de passe incorrect' })
        const pass = await bcrypt.compare(password, user.password_hash)
        if (!pass) return res.status(401).json({ message: 'Email ou mot de passe incorrect' })

        const code = await otpService.creerOtp(user.id, 'email', email)
        const resultat = await mailService.envoyerOtp(email, code, user.username)

        res.status(200).json({
            message: `Code otp envoye sur l\'email ${user.email}, ce code expire dans 5 minute`
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Erreur lors de la connexion par email' })
    }
}

async function loginMobile(req, res) {
    try {
        const { telephone, password } = req.body
        if (!telephone || !password) return res.status(400).json({ messgae: 'Donnée invalide' })
        const user = await userService.trouverParTel(telephone)
        if (!user) return res.status(401).json({ message: 'Numéro de télèphone ou mot de passe incorrect' })
        const compare = await bcrypt.compare(password, user.password_hash)
        if (!compare) return res.status(401).json({ message: 'Numéro de télèphone ou mot de passe incorrect' })
        const telCle = normaliserTelephone(telephone)
        const code = await otpService.creerOtp(user.id, 'sms', telCle)
        const resultat = await smsService.envoyerOtp(telCle, code)
        res.status(200).json({ message: `Code otp envoye au numero ${user.telephone},  ce code expire dans 5 minute`, codeOtp: code })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Erreur lors de la connexion via le mobile' })
    }
}

async function requestOtp(req, res) {

}

module.exports = {
    getMe,
    signup,
    loginWeb,
    loginMobile,
    requestOtp
};
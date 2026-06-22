const bcrypt = require('bcrypt');
const userService = require('../services/user_service');
const otpService = require('../services/otp');
const mailService = require('../services/email');
const smsService = require('../services/sms');
const tokenService = require('../services/token');

async function getMe(req, res) {
    res.status(200).json({ message: 'Profil', user: req.user })
}

async function signup(req, res) {
    try {
        const { username, email, tel, genre, password, type_utilisateur } = req.body;
        const existantParEmail = await userService.trouverParEmail(email)

        if (!username || !email || !tel || !genre || !password || !type_utilisateur) {
            return res.status(400).json({ message: 'Donnée manquante' })
        }
        if (existantParEmail) return res.status(400).json({
            message: 'Email déjà utilisé'
        })
        const existantParTel = await userService.trouverParTel(tel)
        if (existantParTel) return res.status(400).json({ message: 'Numero de telephone deja utilise' })

        const password_hash = bcrypt.hash(password)

        const user = await userService.creerUtilisateur(username, email, tel, genre, password_hash, type_utilisateur)
        res.status(201).json({
            message: 'Client creer avec succes',
            ...(process.env.NODE_ENV !== 'production' && { debug_otp: resultat.code })
        });

    } catch (error) {
        res.status(500).json({
            message: 'Erreur serveur lors de l\'inscription'
        })
    }

}

async function loginWeb(req, res) {
    try {
        const { email, password } = req.body
        if (!email || !password) res.status(400).json({ message: 'Donnée manquante' })

        const user = await userService.trouverParEmail(email)
        if (!user) return res.status(401).json({ message: 'Email ou mot de passe incorrect' })
        const pass = bcrypt.compare(password, user.password_hash)
        if (!pass) return res.status(401).json({ message: 'Email ou mot de passe incorrect' })

        const code = await otpService.creerOtp(user.id, 'email', email)
        const resultat = await mailService.envoyerOtp(email, code, user.username)

        res.status(200).json({
            message: `Code otp envoye sur l\'email ${user.email}, ce code expire dans 5 minute`
        })
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la connexion par email' })
    }
}

async function loginMobile(req, res) {
    try {
        const { tel, password } = req.body
        if (!tel || !password) return res.status(400).json({ messgae: 'Donnée invalide' })
        const user = userService.trouverParTel(tel)
        if (!user) return res.status(401).json({ message: 'Numéro de télèphone ou mot de passe incorrect' })
        const compare = bcrypt.compare(password, user.password_hash)
        if (!compare) return res.status(401).json({ message: 'Numéro de télèphone ou mot de passe incorrect' })
        const code = await otpService.creerOtp(user.id, 'email', email)
        const resultat = await smsService.envoyerOtp(tel, code)
        res.status(200).json({ message: `Code otp envoye au numero ${user.tel},  ce code expire dans 5 minute` })
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la connexion via le mobile' })
    }
}

async function requestOtp(req, res) {

}
const { OtpCode } = require('../models');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

const DUREE_VALIDITE_MINUTES = 5;
const MAX_TENTATIVES = 5;

function genererOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Crée un OTP UNIQUE toutes les 5 minutes (Bloque le renvoi si un code est encore actif)
 */
async function creerOtp(user_id, canal, destinataire) {
    const maintenant = new Date();

    const codeEnCourDeValidite = await OtpCode.findOne({
        where: {
            user_id,
            utilise: false,
            expire_at: {
                [Op.gt]: maintenant
            }
        }
    });

    if (codeEnCourDeValidite) {
        const tempsRestantMs = codeEnCourDeValidite.expire_at - maintenant;
        const minutesRestantes = Math.ceil(tempsRestantMs / 60000);

        const error = new Error(`Un code est déjà actif. Veuillez attendre encore ${minutesRestantes} minute(s) avant d'en renvoyer un autre.`);
        error.statusCode = 429;
        throw error;
    }

    const otp = genererOtp();
    const code_hash = await bcrypt.hash(otp, 10);
    const expire_at = new Date(Date.now() + DUREE_VALIDITE_MINUTES * 60 * 1000);

    await OtpCode.create({
        user_id,
        canal,
        destinataire,
        code_hash,
        expire_at,
        utilise: false,
        tentatives: 0
    });

    return otp;
}

/**
 * Vérification de l'OTP avec incrémentation des tentatives de saisie
 */
async function verifierOtp(user_id, codeSaisi) {
    const otpRecord = await OtpCode.findOne({
        where: { user_id, utilise: false },
        order: [
            ['createdAt', 'DESC']
        ]
    });

    if (!otpRecord) {
        return { valide: false, message: "Aucun code en attente pour cet utilisateur." };
    }

    if (new Date() > otpRecord.expire_at) {
        return { valide: false, message: "Le code OTP a expiré. Veuillez en demander un nouveau." };
    }

    if (otpRecord.tentatives >= MAX_TENTATIVES) {
        return { valide: false, message: "Trop de tentatives infructueuses sur ce code. Demandez-en un nouveau." };
    }

    const correspond = await bcrypt.compare(codeSaisi, otpRecord.code_hash);

    if (!correspond) {
        otpRecord.tentatives += 1;
        await otpRecord.save();

        const restants = MAX_TENTATIVES - otpRecord.tentatives;
        return {
            valide: false,
            message: restants > 0 ?
                `Code OTP incorrect. Il vous reste ${restants} tentatives.` : "Code OTP incorrect. Nombre maximal de tentatives atteint."
        };
    }

    otpRecord.utilise = true;
    await otpRecord.save();

    return { valide: true, userId: otpRecord.user_id };
}

module.exports = { creerOtp, verifierOtp };
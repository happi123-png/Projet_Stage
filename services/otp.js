const { OtpCode } = require('../models');
const bcrypt = require('bcrypt');

const DUREE_VALIDITE_MINUTES = 5;
const MAX_TENTATIVES = 5;

// Génération d'un code à 6 chiffres
function genererOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

async function creerOtp(user_id, canal, destinataire) {
    const otp = genererOtp();
    const code_hash = await bcrypt.hash(otp, 10);
    const expire_at = new Date(Date.now() + DUREE_VALIDITE_MINUTES * 60 * 1000);

    await OtpCode.create({
        user_id,
        canal,
        destinataire,
        code_hash, // ✅ Correction ici aussi
        expire_at
    });
    //MonMotDePasseSecurise2026!
    return otp;
}

/**
 * Vérifie l'OTP fourni par l'utilisateur
 */
async function verifierOtp(user_id, codeSaisi) {
    const otpRecord = await OtpCode.findOne({
        where: { user_id, utilise: false },
        order: [
            ['createdAt', 'DESC']
        ]
    });

    if (!otpRecord) {
        return { valide: false, message: "Aucun code en attente pour cet utilisateur" };
    }

    if (otpRecord.tentatives >= MAX_TENTATIVES) {
        return { valide: false, message: "Nombre maximal de tentatives dépassé" };
    }

    if (new Date() > otpRecord.expire_at) {
        return { valide: false, message: "Le code OTP a expiré" };
    }

    const correspond = await bcrypt.compare(codeSaisi, otpRecord.code_hash);

    if (!correspond) {
        otpRecord.tentatives += 1;
        await otpRecord.save();
        return { valide: false, message: "Code OTP incorrect" };
    }

    otpRecord.utilise = true;
    await otpRecord.save();

    return { valide: true, userId: otpRecord.user_id };
}

module.exports = { creerOtp, verifierOtp };
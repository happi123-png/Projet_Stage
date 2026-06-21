const { OtpCode } = require('../models')
const bcrypt = require('bcrypt')

const DUREE_VALIDITE_MINUTES = 5;
const MAX_TENTATIVES = 5;

function genererOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

async function creerOtp(user_id, canal, destinataire) {
    const otp = genererOtp()
    const code_ash = await bcrypt.hash(otp, 10);
    const expire_at = new Date(Date.now() + DUREE_VALIDITE_MINUTES * 60 * 1000);

    await OtpCode.create({
        user_id: user_id,
        canal,
        destinataire,
        code_ash,
        expire_at
    })

    return code
}

async function verifierOtp(destinataire, canal, codeSaisi) {
    const otp = await OtpCode.findOne({
        where: { destinataire, canal, utilise: false },
        order: [
            ['createdAt', 'DESC']
        ]
    });

    if (!otp) {
        return { valide: false, message: 'Aucun code en attente pour ce destinataire' };
    }

    if (new Date() > otp.expire_at) {
        return { valide: false, message: 'Code expiré' };
    }

    if (otp.tentatives >= MAX_TENTATIVES) {
        return { valide: false, message: 'Nombre de tentatives dépassé' };
    }

    const correspond = await bcrypt.compare(codeSaisi, otp.code_hash);

    if (!correspond) {
        otp.tentatives += 1;
        await otp.save();
        return { valide: false, message: 'Code incorrect' };
    }

    otp.utilise = true;
    await otp.save();

    return { valide: true, userId: otp.user_id };
}

module.exports = { creerOtp, verifierOtp };
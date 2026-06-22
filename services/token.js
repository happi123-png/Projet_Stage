const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const { RefreshToken } = require('../models')

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY_DAYS = 30;

function genererAccessToken(user) {
    return jwt.sign({
            id: user.id,
            email: user.email || null,
            telephone: user.telephone || null
        },
        process.env.JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY }
    );
}

async function genererRefreshToken(userId) {
    const tokenBrut = crypto.randomBytes(40).toString('hex');
    const token_hash = crypto.createHash('sha256').update(tokenBrut).digest('hex');
    const expire_at = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

    await RefreshToken.create({
        user_id: userId,
        token_hash,
        expire_at,
        revoque: false
    });

    return tokenBrut;
}

function verifierAccessToken(token) {
    return crypto.verify(token, process.env.JWT_SECRET)
}

async function verifierRefreshToken(tokenBrut) {
    const token_hash = crypto.createHash('sha256').update(tokenBrut).digest('hex');

    const entree = await RefreshToken.findOne({
        where: { token_hash, revoque: false }
    });

    if (!entree) return null;
    if (new Date() > entree.expire_at) return null;

    return entree;
}

async function revoquerRefreshToken(tokenBrut) {
    const token_hash = crypto.createHash('sha256').update(tokenBrut).digest('hex');
    await RefreshToken.update({ revoque: true }, { where: { token_hash } });
}

module.exports = {
    genererAccessToken,
    genererRefreshToken,
    verifierAccessToken,
    verifierRefreshToken,
    revoquerRefreshToken
};
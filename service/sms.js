/**
 * Service d'envoi de SMS
 * 
 * Version DÉVELOPPEMENT : ne fait pas de vrai envoi.
 * Retourne le code dans la réponse pour faciliter les tests via Postman.
 * 
 * ⚠️ À retirer absolument avant la mise en production —
 * un vrai SMS ne doit jamais révéler le code dans la réponse HTTP.
 */

async function envoyerOtp(numero, code) {
    console.log(`[SMS] Code OTP pour ${numero} : ${code}`);

    return {
        success: true,
        provider: 'console-dev',
        destinataire: numero,
        code // exposé uniquement en dev pour faciliter les tests
    };
}

module.exports = { envoyerOtp };

/* ============================================================
   EXEMPLE POUR LA PRODUCTION — Twilio (à activer plus tard)
   ============================================================

const twilio = require('twilio');
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

async function envoyerOtp(numero, code) {
    await client.messages.create({
        body: `Votre code de vérification est : ${code}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: numero
    });
    return { success: true, provider: 'twilio' };
}

module.exports = { envoyerOtp };

============================================================ */
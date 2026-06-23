const crypto = require('crypto');
const { Professionnel } = require('../models');

/**
 * Génère un code de 8 caractères aléatoires (Chiffres + Majuscules + Minuscules)
 * Exemple : aB3x9Zt1
 */
function genererCode8Caracteres() {
    const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';

    for (let i = 0; i < 8; i++) {
        const randomIndex = crypto.randomInt(0, alphabet.length);
        code += alphabet[randomIndex];
    }

    return code;
}

/**
 * Génère le code de 8 caractères et s'assure qu'il est unique en BDD
 */
async function obtenirCodeParrainageUnique() {
    let codeTrouve = false;
    let codeGenere = '';

    while (!codeTrouve) {
        codeGenere = genererCode8Caracteres();

        const doublon = await Professionnel.findOne({
            where: { code_parrainage_propre: codeGenere }
        });

        if (!doublon) {
            codeTrouve = true;
        }
    }

    return codeGenere;
}

async function creerProfessionnel({ utilisateur_id, type_professionnel, nom_usage }, transaction = null) {
    const code = await obtenirCodeParrainageUnique();
    return await Professionnel.create({
        utilisateur_id: utilisateur_id,
        type_professionnel: type_professionnel || null,
        nom_usage: nom_usage || null, // Prendra la valeur envoyée ou null
        description: null,
        adresse: null,
        ville: null,
        latitude: null,
        longitude: null,
        est_verifie: false,
        note_moyenne: 0.0,
        code_parrainage_propre: code
    }, { transaction });
}
module.exports = { creerProfessionnel };
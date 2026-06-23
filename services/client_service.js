const { Client } = require('../models');

async function creerClient({
    utilisateur_id,
    nom,
    prenom,
    codeParrain
}) {
    return Client.create({
        utilisateur_id: utilisateur_id,
        nom: nom || null,
        prenom: prenom || null,
        codeParrain: codeParrain || null
    })
}

module.exports = {
    creerClient
}
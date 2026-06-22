const { Utilisateur } = require('../models');

async function trouverParEmail(email) {
    return Utilisateur.findOne({ where: { email } });
}

async function trouverParTel(telephone) {
    return Utilisateur.findOne({ where: { telephone } });
}

async function trouverParId(id) {
    return Utilisateur.findOne({ where: { id } });
}

/*async function trouverAdminParEmail(email) {
    return AdminUser.findOne({ where: { email } });
}*/

async function creerUtilisateur({ username, email, telephone, genre, password_hash, type_utilisateur }) {
    return Utilisateur.create({
        username,
        email: email,
        telephone: telephone,
        genre: genre,
        password_hash: password_hash,
        type_utilisateur: type_utilisateur,
        statut: 'pending'
    });
}

async function activerCompte(userId) {
    return Utilisateur.update({ statut: 'active' }, { where: { id: userId } });
}

module.exports = {
    trouverParEmail,
    trouverParTel,
    trouverParId,
    creerUtilisateur,
    activerCompte
};
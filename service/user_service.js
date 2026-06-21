const { User, AdminUser } = require('../models');

async function trouverParEmail(email) {
    return User.findOne({ where: { email } });
}

async function trouverParTelephone(telephone) {
    return User.findOne({ where: { telephone } });
}

async function trouverAdminParEmail(email) {
    return AdminUser.findOne({ where: { email } });
}

async function creerUtilisateur({ nom, email, telephone, password_hash }) {
    return User.create({
        nom,
        email: email || null,
        telephone: telephone || null,
        password_hash,
        statut: 'pending'
    });
}

async function activerCompte(userId) {
    return User.update({ statut: 'active' }, { where: { id: userId } });
}

module.exports = {
    trouverParEmail,
    trouverParTelephone,
    trouverAdminParEmail,
    creerUtilisateur,
    activerCompte
};
const sequelize = require('../config/database'); // Ton instance Sequelize
const Utilisateur = require('./Utilisateur');
const Client = require('./Client');
const Professionnel = require('./Professionnel');
const Administrateur = require('./Administrateur');

Utilisateur.hasOne(Client, { foreignKey: 'utilisateur_id', onDelete: 'CASCADE' });
Client.belongsTo(Utilisateur, { foreignKey: 'utilisateur_id' });

Utilisateur.hasOne(Professionnel, { foreignKey: 'utilisateur_id', onDelete: 'CASCADE' });
Professionnel.belongsTo(Utilisateur, { foreignKey: 'utilisateur_id' });

Utilisateur.hasOne(Administrateur, { foreignKey: 'utilisateur_id', onDelete: 'CASCADE' });
Administrateur.belongsTo(Utilisateur, { foreignKey: 'utilisateur_id' });

module.exports = {
    sequelize,
    Utilisateur,
    Client,
    Professionnel,
    Administrateur
};
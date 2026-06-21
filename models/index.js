const sequelize = require('../config/database');
const Utilisateur = require('./Utilisateur');
const Client = require('./Client');
const Professionnel = require('./Professionnel');
const Administrateur = require('./Administrateur');
const OtpCode = require('./OtpCode');
const RefreshToken = require('./RefreshToken')

Utilisateur.hasOne(Client, { foreignKey: 'utilisateur_id', onDelete: 'CASCADE' });
Client.belongsTo(Utilisateur, { foreignKey: 'utilisateur_id' });

Utilisateur.hasOne(Professionnel, { foreignKey: 'utilisateur_id', onDelete: 'CASCADE' });
Professionnel.belongsTo(Utilisateur, { foreignKey: 'utilisateur_id' });

Utilisateur.hasOne(Administrateur, { foreignKey: 'utilisateur_id', onDelete: 'CASCADE' });
Administrateur.belongsTo(Utilisateur, { foreignKey: 'utilisateur_id' });

OtpCode.belongsTo(Utilisateur, { foreignKey: 'user_id' });

Utilisateur.hasMany(RefreshToken, { foreignKey: 'user_id' });
RefreshToken.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
    sequelize,
    Utilisateur,
    Client,
    Professionnel,
    Administrateur,
    OtpCode,
    RefreshToken
};
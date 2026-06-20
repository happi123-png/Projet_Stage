const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Client = sequelize.define('Client', {
    utilisateur_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    nom: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    prenom: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
}, {
    tableName: 'clients',
    timestamps: true
});

module.exports = Client;
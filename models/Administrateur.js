const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Administrateur = sequelize.define('Administrateur', {
    utilisateur_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    role_admin: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'SUPPORT'
    }
}, {
    tableName: 'administrateurs',
    timestamps: true
});

module.exports = Administrateur;
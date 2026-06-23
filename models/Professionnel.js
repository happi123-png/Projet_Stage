const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Professionnel = sequelize.define('Professionnel', {
    utilisateur_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    type_professionnel: {
        type: DataTypes.ENUM('COIFFEUR_INDEPENDANT', 'SALON'),
        allowNull: true
    },
    nom_usage: {
        type: DataTypes.STRING(150),
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    adresse: {
        type: DataTypes.STRING,
        allowNull: true
    },
    ville: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    latitude: {
        type: DataTypes.DOUBLE,
        allowNull: true
    },
    longitude: {
        type: DataTypes.DOUBLE,
        allowNull: true
    },
    est_verifie: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    note_moyenne: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0.0
    },
    code_parrainage_propre: {
        type: DataTypes.STRING(50),
        allowNull: true,
        unique: true
    }
}, {
    tableName: 'professionnels',
    timestamps: true
});

module.exports = Professionnel;
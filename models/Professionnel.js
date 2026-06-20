const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Professionnel = sequelize.define('Professionnel', {
    utilisateur_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    type_professionnel: {
        type: DataTypes.ENUM('COIFFEUR_INDEPENDANT', 'SALON'),
        allowNull: false
    },
    nom_usage: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    adresse: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ville: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    latitude: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    longitude: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    est_verifie: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    note_moyenne: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.0
    },
    code_parrainage_propre: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'professionnels',
    timestamps: true
});

module.exports = Professionnel;
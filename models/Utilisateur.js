const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Utilisateur = sequelize.define('Utilisateur', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    telephone: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    genre: {
        type: DataTypes.ENUM('MASCULIN', 'FEMININ'),
        allowNull: false
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: true
    },
    google_id: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    type_utilisateur: {
        type: DataTypes.ENUM('CLIENT', 'PROFESSIONNEL', 'ADMIN'),
        allowNull: false
    },
    photo_profil: {
        type: DataTypes.STRING,
        allowNull: true
    },
    statut_compte: {
        type: DataTypes.ENUM('PENDING', 'ACTIF', 'SUSPENDU'),
        allowNull: false,
        defaultValue: 'PENDING'
    }
}, {
    tableName: 'utilisateurs',
    timestamps: true,
});

module.exports = Utilisateur;
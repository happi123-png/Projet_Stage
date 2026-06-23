const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OtpCode = sequelize.define('OtpCode', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    canal: {
        type: DataTypes.ENUM('email', 'sms'),
        allowNull: false
    },
    destinataire: {
        type: DataTypes.STRING,
        allowNull: false
    },
    code_hash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tentatives: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    expire_at: {
        type: DataTypes.DATE,
        allowNull: false
    },
    utilise: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    valide: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    tableName: 'otp_codes',
    timestamps: true
});

module.exports = OtpCode;
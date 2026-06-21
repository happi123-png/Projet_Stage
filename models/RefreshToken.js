const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RefreshToken = sequelize.define('RefreshToken', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    token_hash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    expire_at: {
        type: DataTypes.DATE,
        allowNull: false
    },
    revoque: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    tableName: 'refresh_tokens',
    timestamps: true
});

module.exports = RefreshToken;
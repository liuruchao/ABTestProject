"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const index_1 = require("./index");
class Experiment extends sequelize_1.Model {
}
Experiment.init({
    id: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
        defaultValue: () => `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('draft', 'running', 'paused', 'ended'),
        defaultValue: 'draft'
    },
    layer: {
        type: sequelize_1.DataTypes.ENUM('ui', 'strategy', 'algorithm', 'marketing'),
        allowNull: false
    },
    trafficRatio: {
        type: sequelize_1.DataTypes.FLOAT,
        defaultValue: 100
    },
    mutexGroupId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    priority: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0
    },
    createdAt: {
        type: sequelize_1.DataTypes.BIGINT,
        defaultValue: () => Date.now()
    },
    updatedAt: {
        type: sequelize_1.DataTypes.BIGINT,
        defaultValue: () => Date.now()
    }
}, {
    sequelize: index_1.sequelize,
    modelName: 'Experiment',
    timestamps: false
});
exports.default = Experiment;
//# sourceMappingURL=Experiment.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const index_1 = require("./index");
const Experiment_1 = __importDefault(require("./Experiment"));
class ExperimentGroup extends sequelize_1.Model {
}
ExperimentGroup.init({
    id: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
        defaultValue: () => `group_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    },
    experimentId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        references: {
            model: Experiment_1.default,
            key: 'id'
        }
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    ratio: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false
    },
    variables: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        defaultValue: '{}'
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
    modelName: 'ExperimentGroup',
    timestamps: false
});
Experiment_1.default.hasMany(ExperimentGroup, {
    foreignKey: 'experimentId',
    as: 'groups'
});
ExperimentGroup.belongsTo(Experiment_1.default, {
    foreignKey: 'experimentId',
    as: 'experiment'
});
exports.default = ExperimentGroup;
//# sourceMappingURL=ExperimentGroup.js.map
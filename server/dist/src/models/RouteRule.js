"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const index_1 = require("./index");
const Experiment_1 = __importDefault(require("./Experiment"));
class RouteRule extends sequelize_1.Model {
}
RouteRule.init({
    id: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
        defaultValue: () => `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    },
    experimentId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        references: {
            model: Experiment_1.default,
            key: 'id'
        }
    },
    type: {
        type: sequelize_1.DataTypes.ENUM('exact', 'wildcard', 'hierarchy'),
        allowNull: false
    },
    pattern: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
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
    modelName: 'RouteRule',
    timestamps: false
});
Experiment_1.default.hasMany(RouteRule, {
    foreignKey: 'experimentId',
    as: 'routeRules'
});
RouteRule.belongsTo(Experiment_1.default, {
    foreignKey: 'experimentId',
    as: 'experiment'
});
exports.default = RouteRule;
//# sourceMappingURL=RouteRule.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteRule = exports.ExperimentGroup = exports.Experiment = exports.sequelize = exports.initDatabase = void 0;
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false
});
exports.sequelize = sequelize;
const Experiment_1 = __importDefault(require("./Experiment"));
exports.Experiment = Experiment_1.default;
const ExperimentGroup_1 = __importDefault(require("./ExperimentGroup"));
exports.ExperimentGroup = ExperimentGroup_1.default;
const RouteRule_1 = __importDefault(require("./RouteRule"));
exports.RouteRule = RouteRule_1.default;
const initDatabase = async () => {
    try {
        await sequelize.sync({
            force: true,
            logging: false
        });
        console.log('Database initialized successfully');
    }
    catch (error) {
        console.error('Database initialization failed:', error);
        throw error;
    }
};
exports.initDatabase = initDatabase;
//# sourceMappingURL=index.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("tsconfig-paths/register");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const experiment_1 = __importDefault(require("./routes/experiment"));
const config_1 = __importDefault(require("./routes/config"));
const models_1 = require("./models");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/experiment', experiment_1.default);
app.use('/api/config', config_1.default);
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: Date.now() });
});
(0, models_1.initDatabase)()
    .then(() => {
    app.listen(PORT, () => {
        console.log(`A/B Test Server running on port ${PORT}`);
    });
})
    .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map
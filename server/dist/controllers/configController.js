"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigController = void 0;
const configService_1 = require("../services/configService");
class ConfigController {
    constructor() {
        this.getGlobalConfig = async (req, res) => {
            try {
                const config = await this.configService.getGlobalConfig();
                res.json(config);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to fetch global config' });
            }
        };
        this.getPageConfig = async (req, res) => {
            try {
                const { route } = req.query;
                const config = await this.configService.getPageConfig(route);
                res.json(config);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to fetch page config' });
            }
        };
        this.syncConfig = async (req, res) => {
            try {
                const result = await this.configService.syncConfig(req.body);
                res.json(result);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to sync config' });
            }
        };
        this.configService = new configService_1.ConfigService();
    }
}
exports.ConfigController = ConfigController;
//# sourceMappingURL=configController.js.map
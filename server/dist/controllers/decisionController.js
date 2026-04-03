"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecisionController = void 0;
const decisionService_1 = require("../services/decisionService");
class DecisionController {
    constructor() {
        this.assignGroup = async (req, res) => {
            try {
                const { userId, deviceId, experimentId } = req.body;
                const result = await this.decisionService.assignGroup(userId, deviceId, experimentId);
                res.json(result);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to assign group' });
            }
        };
        this.validateGroup = async (req, res) => {
            try {
                const { userId, deviceId, experimentId, groupId } = req.body;
                const result = await this.decisionService.validateGroup(userId, deviceId, experimentId, groupId);
                res.json(result);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to validate group' });
            }
        };
        this.decisionService = new decisionService_1.DecisionService();
    }
}
exports.DecisionController = DecisionController;
//# sourceMappingURL=decisionController.js.map
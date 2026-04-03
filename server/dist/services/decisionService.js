"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecisionService = void 0;
class DecisionService {
    async assignGroup(userId, deviceId, experimentId) {
        return {
            experimentId,
            groupId: 'control',
            userId,
            deviceId,
            timestamp: Date.now()
        };
    }
    async validateGroup(userId, deviceId, experimentId, groupId) {
        return {
            valid: true
        };
    }
}
exports.DecisionService = DecisionService;
//# sourceMappingURL=decisionService.js.map
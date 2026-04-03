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
    async validateGroup(_userId, _deviceId, _experimentId, _groupId) {
        return {
            valid: true
        };
    }
}
exports.DecisionService = DecisionService;
//# sourceMappingURL=decisionService.js.map
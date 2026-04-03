"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRouteMatch = validateRouteMatch;
exports.simpleHash = simpleHash;
exports.getExperimentHash = getExperimentHash;
exports.assignGroupByHash = assignGroupByHash;
function validateRouteMatch(currentRoute, routeRules) {
    return routeRules.some(rule => {
        switch (rule.type) {
            case 'exact':
                return currentRoute === rule.pattern;
            case 'wildcard':
                return currentRoute.startsWith(rule.pattern.replace('*', ''));
            case 'hierarchy':
                return currentRoute.startsWith(rule.pattern);
            default:
                return false;
        }
    });
}
function simpleHash(input) {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
        const char = input.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
}
function getExperimentHash(userId, deviceId, experimentId) {
    const input = `${userId || deviceId}_${experimentId}`;
    return simpleHash(input);
}
function assignGroupByHash(hash, groups) {
    const totalRatio = groups.reduce((sum, group) => sum + group.ratio, 0);
    const normalizedHash = (hash % 100) / 100;
    let cumulativeRatio = 0;
    for (const group of groups) {
        cumulativeRatio += group.ratio / totalRatio;
        if (normalizedHash <= cumulativeRatio) {
            return group.id;
        }
    }
    return groups[0].id;
}
//# sourceMappingURL=hash.js.map
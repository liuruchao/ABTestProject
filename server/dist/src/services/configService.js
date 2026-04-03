"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigService = void 0;
const models_1 = require("../models");
const hash_1 = require("@shared/utils/hash");
class ConfigService {
    async getGlobalConfig() {
        const experiments = await models_1.Experiment.findAll({
            include: [
                {
                    model: models_1.RouteRule,
                    as: 'routeRules'
                }
            ],
            where: {
                status: 'running'
            }
        });
        const experimentMetadata = experiments.map(exp => ({
            id: exp.id,
            name: exp.name,
            layer: exp.layer,
            routeRules: exp.routeRules.map((rule) => ({
                type: rule.type,
                pattern: rule.pattern
            })),
            mutexGroupId: exp.mutexGroupId,
            priority: exp.priority,
            status: exp.status
        }));
        return {
            version: '1.0.0',
            experiments: experimentMetadata,
            lastUpdated: Date.now()
        };
    }
    async getPageConfig(route) {
        const allExperiments = await models_1.Experiment.findAll({
            include: [
                {
                    model: models_1.ExperimentGroup,
                    as: 'groups'
                },
                {
                    model: models_1.RouteRule,
                    as: 'routeRules'
                }
            ],
            where: {
                status: 'running'
            }
        });
        const matchedExperiments = allExperiments.filter(exp => (0, hash_1.validateRouteMatch)(route, exp.routeRules));
        const resolvedExperiments = this.resolveExperimentConflicts(matchedExperiments);
        const experiments = resolvedExperiments.map(exp => ({
            id: exp.id,
            name: exp.name,
            description: exp.description,
            status: exp.status,
            layer: exp.layer,
            routeRules: exp.routeRules.map((rule) => ({
                type: rule.type,
                pattern: rule.pattern
            })),
            trafficRatio: exp.trafficRatio,
            groups: exp.groups.map((group) => ({
                id: group.id,
                name: group.name,
                ratio: group.ratio,
                variables: JSON.parse(group.variables || '{}')
            })),
            mutexGroupId: exp.mutexGroupId,
            priority: exp.priority,
            createdAt: exp.createdAt,
            updatedAt: exp.updatedAt
        }));
        return {
            route,
            experiments,
            lastUpdated: Date.now()
        };
    }
    async syncConfig(_config) {
        return { success: true, message: 'Config synced successfully' };
    }
    resolveExperimentConflicts(experiments) {
        const experimentsByLayer = {};
        experiments.forEach(exp => {
            if (!experimentsByLayer[exp.layer]) {
                experimentsByLayer[exp.layer] = [];
            }
            experimentsByLayer[exp.layer].push(exp);
        });
        const resolvedExperiments = [];
        Object.values(experimentsByLayer).forEach(layerExperiments => {
            const experimentsByMutex = {};
            layerExperiments.forEach(exp => {
                const mutexGroupId = exp.mutexGroupId || 'default';
                if (!experimentsByMutex[mutexGroupId]) {
                    experimentsByMutex[mutexGroupId] = [];
                }
                experimentsByMutex[mutexGroupId].push(exp);
            });
            Object.values(experimentsByMutex).forEach(mutexExperiments => {
                mutexExperiments.sort((a, b) => b.priority - a.priority);
                if (mutexExperiments.length > 0) {
                    resolvedExperiments.push(mutexExperiments[0]);
                }
            });
        });
        return resolvedExperiments;
    }
}
exports.ConfigService = ConfigService;
//# sourceMappingURL=configService.js.map
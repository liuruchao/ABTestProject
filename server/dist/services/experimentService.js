"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExperimentService = void 0;
const models_1 = require("../models");
class ExperimentService {
    async listExperiments() {
        const experiments = await models_1.Experiment.findAll({
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
            order: [['createdAt', 'DESC']]
        });
        return experiments.map(exp => this.mapToExperimentType(exp));
    }
    async createExperiment(data) {
        const { groups = [], routeRules = [], ...experimentData } = data;
        const experiment = await models_1.Experiment.create(experimentData);
        if (groups.length > 0) {
            await Promise.all(groups.map((group) => models_1.ExperimentGroup.create({
                ...group,
                experimentId: experiment.id,
                variables: JSON.stringify(group.variables || {})
            })));
        }
        if (routeRules.length > 0) {
            await Promise.all(routeRules.map((rule) => models_1.RouteRule.create({
                ...rule,
                experimentId: experiment.id
            })));
        }
        const createdExperiment = await models_1.Experiment.findByPk(experiment.id, {
            include: [
                {
                    model: models_1.ExperimentGroup,
                    as: 'groups'
                },
                {
                    model: models_1.RouteRule,
                    as: 'routeRules'
                }
            ]
        });
        return this.mapToExperimentType(createdExperiment);
    }
    async updateExperiment(id, data) {
        const { groups = [], routeRules = [], ...experimentData } = data;
        const experiment = await models_1.Experiment.findByPk(id);
        if (!experiment) {
            throw new Error('Experiment not found');
        }
        await experiment.update({
            ...experimentData,
            updatedAt: Date.now()
        });
        await models_1.ExperimentGroup.destroy({ where: { experimentId: id } });
        if (groups.length > 0) {
            await Promise.all(groups.map((group) => models_1.ExperimentGroup.create({
                ...group,
                experimentId: id,
                variables: JSON.stringify(group.variables || {})
            })));
        }
        await models_1.RouteRule.destroy({ where: { experimentId: id } });
        if (routeRules.length > 0) {
            await Promise.all(routeRules.map((rule) => models_1.RouteRule.create({
                ...rule,
                experimentId: id
            })));
        }
        const updatedExperiment = await models_1.Experiment.findByPk(id, {
            include: [
                {
                    model: models_1.ExperimentGroup,
                    as: 'groups'
                },
                {
                    model: models_1.RouteRule,
                    as: 'routeRules'
                }
            ]
        });
        return this.mapToExperimentType(updatedExperiment);
    }
    async deleteExperiment(id) {
        const experiment = await models_1.Experiment.findByPk(id);
        if (!experiment) {
            throw new Error('Experiment not found');
        }
        await models_1.ExperimentGroup.destroy({ where: { experimentId: id } });
        await models_1.RouteRule.destroy({ where: { experimentId: id } });
        await experiment.destroy();
    }
    async getExperiment(id) {
        const experiment = await models_1.Experiment.findByPk(id, {
            include: [
                {
                    model: models_1.ExperimentGroup,
                    as: 'groups'
                },
                {
                    model: models_1.RouteRule,
                    as: 'routeRules'
                }
            ]
        });
        if (!experiment) {
            throw new Error('Experiment not found');
        }
        return this.mapToExperimentType(experiment);
    }
    mapToExperimentType(experiment) {
        return {
            id: experiment.id,
            name: experiment.name,
            description: experiment.description,
            status: experiment.status,
            layer: experiment.layer,
            routeRules: experiment.routeRules.map((rule) => ({
                type: rule.type,
                pattern: rule.pattern
            })),
            trafficRatio: experiment.trafficRatio,
            groups: experiment.groups.map((group) => ({
                id: group.id,
                name: group.name,
                ratio: group.ratio,
                variables: JSON.parse(group.variables || '{}')
            })),
            mutexGroupId: experiment.mutexGroupId,
            priority: experiment.priority,
            createdAt: experiment.createdAt,
            updatedAt: experiment.updatedAt
        };
    }
    async getExperimentsByRoute(route) {
        const experiments = await models_1.Experiment.findAll({
            include: [
                {
                    model: models_1.ExperimentGroup,
                    as: 'groups'
                },
                {
                    model: models_1.RouteRule,
                    as: 'routeRules'
                }
            ]
        });
        const mappedExperiments = experiments.map(exp => this.mapToExperimentType(exp));
        const runningExperiments = mappedExperiments.filter(exp => exp.status === 'running');
        const routeMatchedExperiments = runningExperiments.filter(experiment => {
            if (!experiment.routeRules || experiment.routeRules.length === 0) {
                return true;
            }
            return experiment.routeRules.some(rule => this.matchRoute(route, rule.pattern, rule.type));
        });
        const finalExperiments = this.applyMutexAndPriority(routeMatchedExperiments);
        return finalExperiments;
    }
    matchRoute(currentRoute, pattern, type) {
        switch (type) {
            case 'exact':
                return currentRoute === pattern;
            case 'wildcard':
                const wildcardPattern = pattern.replace('*', '.*');
                const wildcardRegex = new RegExp(`^${wildcardPattern}$`);
                return wildcardRegex.test(currentRoute);
            case 'hierarchy':
                return currentRoute === pattern || currentRoute.startsWith(`${pattern}/`);
            default:
                return false;
        }
    }
    applyMutexAndPriority(experiments) {
        const experimentsByLayer = new Map();
        experiments.forEach(exp => {
            const layer = exp.layer || 'default';
            if (!experimentsByLayer.has(layer)) {
                experimentsByLayer.set(layer, []);
            }
            experimentsByLayer.get(layer).push(exp);
        });
        const result = [];
        experimentsByLayer.forEach(layerExperiments => {
            const experimentsByMutexGroup = new Map();
            const noMutexExperiments = [];
            layerExperiments.forEach(exp => {
                if (exp.mutexGroupId) {
                    if (!experimentsByMutexGroup.has(exp.mutexGroupId)) {
                        experimentsByMutexGroup.set(exp.mutexGroupId, []);
                    }
                    experimentsByMutexGroup.get(exp.mutexGroupId).push(exp);
                }
                else {
                    noMutexExperiments.push(exp);
                }
            });
            experimentsByMutexGroup.forEach(mutexExperiments => {
                mutexExperiments.sort((a, b) => {
                    if (b.priority !== a.priority) {
                        return b.priority - a.priority;
                    }
                    return b.createdAt - a.createdAt;
                });
                if (mutexExperiments.length > 0) {
                    result.push(mutexExperiments[0]);
                }
            });
            result.push(...noMutexExperiments);
        });
        return result;
    }
}
exports.ExperimentService = ExperimentService;
//# sourceMappingURL=experimentService.js.map
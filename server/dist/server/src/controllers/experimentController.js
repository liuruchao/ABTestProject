"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExperimentController = void 0;
const experimentService_1 = require("../services/experimentService");
class ExperimentController {
    constructor() {
        this.listExperiments = async (_req, res) => {
            try {
                const experiments = await this.experimentService.listExperiments();
                res.json(experiments);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to list experiments' });
            }
        };
        this.createExperiment = async (req, res) => {
            try {
                const experiment = await this.experimentService.createExperiment(req.body);
                res.json(experiment);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to create experiment' });
            }
        };
        this.updateExperiment = async (req, res) => {
            try {
                const { id } = req.params;
                const experiment = await this.experimentService.updateExperiment(id, req.body);
                res.json(experiment);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to update experiment' });
            }
        };
        this.deleteExperiment = async (req, res) => {
            try {
                const { id } = req.params;
                await this.experimentService.deleteExperiment(id);
                res.json({ success: true });
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to delete experiment' });
            }
        };
        this.getExperiment = async (req, res) => {
            try {
                const { id } = req.params;
                const experiment = await this.experimentService.getExperiment(id);
                res.json(experiment);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to fetch experiment' });
            }
        };
        this.getExperimentsByRoute = async (req, res) => {
            try {
                const { route } = req.query;
                if (!route || typeof route !== 'string') {
                    res.status(400).json({ error: 'Route parameter is required' });
                    return;
                }
                const experiments = await this.experimentService.getExperimentsByRoute(route);
                res.json(experiments);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to fetch experiments by route' });
            }
        };
        this.experimentService = new experimentService_1.ExperimentService();
    }
}
exports.ExperimentController = ExperimentController;
//# sourceMappingURL=experimentController.js.map
import { Request, Response } from 'express';
import { ExperimentService } from '../services/experimentService';

export class ExperimentController {
  private experimentService: ExperimentService;

  constructor() {
    this.experimentService = new ExperimentService();
  }

  listExperiments = async (_req: Request, res: Response) => {
    try {
      const experiments = await this.experimentService.listExperiments();
      res.json(experiments);
    } catch (error) {
      res.status(500).json({ error: 'Failed to list experiments' });
    }
  };

  createExperiment = async (req: Request, res: Response) => {
    try {
      const experiment = await this.experimentService.createExperiment(req.body);
      res.json(experiment);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create experiment' });
    }
  };

  updateExperiment = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const experiment = await this.experimentService.updateExperiment(id, req.body);
      res.json(experiment);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update experiment' });
    }
  };

  deleteExperiment = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.experimentService.deleteExperiment(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete experiment' });
    }
  };

  getExperiment = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const experiment = await this.experimentService.getExperiment(id);
      res.json(experiment);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch experiment' });
    }
  };

  getExperimentsByRoute = async (req: Request, res: Response) => {
    try {
      const { route } = req.query;
      if (!route || typeof route !== 'string') {
        res.status(400).json({ error: 'Route parameter is required' });
        return;
      }
      const experiments = await this.experimentService.getExperimentsByRoute(route);
      res.json(experiments);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch experiments by route' });
    }
  };
}

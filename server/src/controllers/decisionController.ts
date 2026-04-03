import { Request, Response } from 'express';
import { DecisionService } from '../services/decisionService';

export class DecisionController {
  private decisionService: DecisionService;

  constructor() {
    this.decisionService = new DecisionService();
  }

  assignGroup = async (req: Request, res: Response) => {
    try {
      const { userId, deviceId, experimentId } = req.body;
      const result = await this.decisionService.assignGroup(userId, deviceId, experimentId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to assign group' });
    }
  };

  validateGroup = async (req: Request, res: Response) => {
    try {
      const { userId, deviceId, experimentId, groupId } = req.body;
      const result = await this.decisionService.validateGroup(userId, deviceId, experimentId, groupId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to validate group' });
    }
  };
}
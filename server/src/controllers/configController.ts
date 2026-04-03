import { Request, Response } from 'express';
import { ConfigService } from '../services/configService';

export class ConfigController {
  private configService: ConfigService;

  constructor() {
    this.configService = new ConfigService();
  }

  getGlobalConfig = async (req: Request, res: Response) => {
    try {
      const config = await this.configService.getGlobalConfig();
      res.json(config);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch global config' });
    }
  };

  getPageConfig = async (req: Request, res: Response) => {
    try {
      const { route } = req.query;
      const config = await this.configService.getPageConfig(route as string);
      res.json(config);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch page config' });
    }
  };

  syncConfig = async (req: Request, res: Response) => {
    try {
      const result = await this.configService.syncConfig(req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to sync config' });
    }
  };
}

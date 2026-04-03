import { Request, Response } from 'express';
export declare class ConfigController {
    private configService;
    constructor();
    getGlobalConfig: (req: Request, res: Response) => Promise<void>;
    getPageConfig: (req: Request, res: Response) => Promise<void>;
    syncConfig: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=configController.d.ts.map
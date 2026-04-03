import { Request, Response } from 'express';
export declare class ExperimentController {
    private experimentService;
    constructor();
    listExperiments: (_req: Request, res: Response) => Promise<void>;
    createExperiment: (req: Request, res: Response) => Promise<void>;
    updateExperiment: (req: Request, res: Response) => Promise<void>;
    deleteExperiment: (req: Request, res: Response) => Promise<void>;
    getExperiment: (req: Request, res: Response) => Promise<void>;
    getExperimentsByRoute: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=experimentController.d.ts.map
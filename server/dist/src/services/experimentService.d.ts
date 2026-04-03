import { Experiment as ExperimentType } from '@shared/types';
export declare class ExperimentService {
    listExperiments(): Promise<ExperimentType[]>;
    createExperiment(data: any): Promise<ExperimentType>;
    updateExperiment(id: string, data: any): Promise<ExperimentType>;
    deleteExperiment(id: string): Promise<void>;
    getExperiment(id: string): Promise<ExperimentType>;
    private mapToExperimentType;
    getExperimentsByRoute(route: string): Promise<ExperimentType[]>;
    private matchRoute;
    private applyMutexAndPriority;
}
//# sourceMappingURL=experimentService.d.ts.map
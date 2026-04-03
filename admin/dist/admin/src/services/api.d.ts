import { Experiment } from '@shared/types';
export declare const experimentApi: {
    listExperiments: () => Promise<Experiment[]>;
    createExperiment: (experiment: Partial<Experiment>) => Promise<Experiment>;
    updateExperiment: (id: string, experiment: Partial<Experiment>) => Promise<Experiment>;
    deleteExperiment: (id: string) => Promise<void>;
    getExperiment: (id: string) => Promise<Experiment>;
};
export declare const configApi: {
    getGlobalConfig: () => Promise<any>;
    getPageConfig: (route: string) => Promise<any>;
    syncConfig: (config: any) => Promise<any>;
};
export declare const decisionApi: {
    assignGroup: (userId: string | undefined, deviceId: string, experimentId: string) => Promise<any>;
    validateGroup: (userId: string | undefined, deviceId: string, experimentId: string, groupId: string) => Promise<any>;
};
declare const _default: {
    experiment: {
        listExperiments: () => Promise<Experiment[]>;
        createExperiment: (experiment: Partial<Experiment>) => Promise<Experiment>;
        updateExperiment: (id: string, experiment: Partial<Experiment>) => Promise<Experiment>;
        deleteExperiment: (id: string) => Promise<void>;
        getExperiment: (id: string) => Promise<Experiment>;
    };
    config: {
        getGlobalConfig: () => Promise<any>;
        getPageConfig: (route: string) => Promise<any>;
        syncConfig: (config: any) => Promise<any>;
    };
    decision: {
        assignGroup: (userId: string | undefined, deviceId: string, experimentId: string) => Promise<any>;
        validateGroup: (userId: string | undefined, deviceId: string, experimentId: string, groupId: string) => Promise<any>;
    };
};
export default _default;
//# sourceMappingURL=api.d.ts.map
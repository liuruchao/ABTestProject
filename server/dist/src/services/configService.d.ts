import { GlobalConfig, PageConfig } from '@shared/types';
export declare class ConfigService {
    getGlobalConfig(): Promise<GlobalConfig>;
    getPageConfig(route: string): Promise<PageConfig>;
    syncConfig(_config: any): Promise<any>;
    private resolveExperimentConflicts;
}
//# sourceMappingURL=configService.d.ts.map
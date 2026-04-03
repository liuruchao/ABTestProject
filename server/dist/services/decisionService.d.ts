import { DecisionResult } from '@shared/types';
export declare class DecisionService {
    assignGroup(userId: string, deviceId: string, experimentId: string): Promise<DecisionResult>;
    validateGroup(userId: string, deviceId: string, experimentId: string, groupId: string): Promise<any>;
}
//# sourceMappingURL=decisionService.d.ts.map
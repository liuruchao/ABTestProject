import { DecisionResult } from '@shared/types';
export declare class DecisionService {
    assignGroup(userId: string, deviceId: string, experimentId: string): Promise<DecisionResult>;
    validateGroup(_userId: string, _deviceId: string, _experimentId: string, _groupId: string): Promise<any>;
}
//# sourceMappingURL=decisionService.d.ts.map
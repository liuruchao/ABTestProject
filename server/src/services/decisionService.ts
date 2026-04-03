import { DecisionResult } from '@shared/types';

export class DecisionService {
  async assignGroup(userId: string, deviceId: string, experimentId: string): Promise<DecisionResult> {
    return {
      experimentId,
      groupId: 'control',
      userId,
      deviceId,
      timestamp: Date.now()
    };
  }

  async validateGroup(_userId: string, _deviceId: string, _experimentId: string, _groupId: string): Promise<any> {
    return {
      valid: true
    };
  }
}

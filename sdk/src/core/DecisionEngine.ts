/**
 * 决策引擎类
 * 负责流量分流、实验决策和冲突解决
 */
import { generateHash, assignGroup, getGroupById } from '../utils/hash';
import { Experiment, UserContext, ExperimentResult, HashResult } from '../types';

export class DecisionEngine {
  /** 用户上下文 */
  private userContext: UserContext;
  /** 登录绑定映射 */
  private loginBindingMap: Map<string, string> = new Map();

  /**
   * 构造函数
   * @param userContext 用户上下文
   */
  constructor(userContext: UserContext) {
    this.userContext = userContext;
  }

  /**
   * 更新用户上下文
   * @param context 用户上下文部分更新
   */
  updateUserContext(context: Partial<UserContext>): void {
    this.userContext = { ...this.userContext, ...context };
  }

  /**
   * 获取当前标识符
   * @returns 当前标识符
   */
  getCurrentIdentifier(): string {
    return this.userContext.userId
      ? this.userContext.userId
      : this.userContext.deviceId;
  }

  /**
   * 为单个实验做出决策
   * @param experiment 实验配置
   * @returns 实验结果
   */
  makeDecision(experiment: Experiment): ExperimentResult | null {
    console.log('=== 决策引擎调试信息 ===');
    console.log('实验ID:', experiment.id);
    console.log('实验名称:', experiment.name);
    console.log('实验状态:', experiment.status);
    
    if (experiment.status !== 'running') {
      console.log('实验未运行，跳过决策');
      return null;
    }

    const identifier = this.getCurrentIdentifier();
    console.log('用户标识符:', identifier);
    console.log('用户ID:', this.userContext.userId);
    console.log('设备ID:', this.userContext.deviceId);
    
    const hashValue = generateHash(identifier, experiment.id);
    console.log('生成的哈希值:', hashValue);
    console.log('实验流量比例:', experiment.trafficRatio);
    
    console.log('实验组配置:');
    experiment.groups.forEach((group, index) => {
      console.log(`  组${index + 1}: ${group.name} (ID: ${group.id}, 比例: ${group.ratio}%, 对照组: ${group.isControl})`);
    });
    
    const groupId = assignGroup(hashValue, experiment.groups);
    console.log('分配的组ID:', groupId);
    
    const group = getGroupById(groupId, experiment.groups);
    console.log('找到的组:', group ? group.name : '未找到');

    if (!group) {
      console.log('未找到对应的实验组，返回null');
      return null;
    }

    console.log('决策成功，命中组:', group.name);
    console.log('=== 决策引擎调试信息结束 ===\n');

    return {
      experimentId: experiment.id,
      groupName: group.name,
      groupId: group.id,
      variables: group.variables || {},
      isControl: group.isControl || false,
      hashValue: hashValue
    };
  }

  /**
   * 为多个实验做出决策
   * @param experiments 实验配置列表
   * @returns 实验结果列表
   */
  makeDecisions(experiments: Experiment[]): ExperimentResult[] {
    const results: ExperimentResult[] = [];
    const processedExperiments = new Set<string>();

    for (const experiment of experiments) {
      if (processedExperiments.has(experiment.id)) {
        continue;
      }

      const result = this.makeDecision(experiment);
      if (result) {
        results.push(result);
        processedExperiments.add(experiment.id);

        if (experiment.mutexGroupId) {
          experiments.forEach(exp => {
            if (exp.mutexGroupId === experiment.mutexGroupId && exp.id !== experiment.id) {
              processedExperiments.add(exp.id);
            }
          });
        }
      }
    }

    return results;
  }

  /**
   * 绑定登录
   * @param userId 用户ID
   */
  bindLogin(userId: string): void {
    const currentIdentifier = this.getCurrentIdentifier();
    if (currentIdentifier !== userId) {
      this.loginBindingMap.set(userId, currentIdentifier);
      this.userContext.userId = userId;
    }
  }

  /**
   * 获取历史标识符
   * @param userId 用户ID
   * @returns 历史标识符
   */
  getHistoricalIdentifier(userId: string): string | null {
    return this.loginBindingMap.get(userId) || null;
  }

  /**
   * 获取哈希详情
   * @param experimentId 实验ID
   * @param experiments 实验配置列表
   * @returns 哈希详情
   */
  getHashDetails(experimentId: string, experiments: Experiment[]): HashResult | null {
    const experiment = experiments.find(e => e.id === experimentId);
    if (!experiment) {
      return null;
    }

    const identifier = this.getCurrentIdentifier();
    const hashValue = generateHash(identifier, experimentId);
    const groupId = assignGroup(hashValue, experiment.groups);
    const group = getGroupById(groupId, experiment.groups);

    if (!group) {
      return null;
    }

    return {
      value: hashValue,
      groupId: group.id,
      groupName: group.name
    };
  }
}
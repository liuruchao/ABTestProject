import { Experiment, UserContext, ExperimentResult, HashResult } from '../types';
export declare class DecisionEngine {
    /** 用户上下文 */
    private userContext;
    /** 登录绑定映射 */
    private loginBindingMap;
    /**
     * 构造函数
     * @param userContext 用户上下文
     */
    constructor(userContext: UserContext);
    /**
     * 更新用户上下文
     * @param context 用户上下文部分更新
     */
    updateUserContext(context: Partial<UserContext>): void;
    /**
     * 获取当前标识符
     * @returns 当前标识符
     */
    getCurrentIdentifier(): string;
    /**
     * 为单个实验做出决策
     * @param experiment 实验配置
     * @returns 实验结果
     */
    makeDecision(experiment: Experiment): ExperimentResult | null;
    /**
     * 为多个实验做出决策
     * @param experiments 实验配置列表
     * @returns 实验结果列表
     */
    makeDecisions(experiments: Experiment[]): ExperimentResult[];
    /**
     * 绑定登录
     * @param userId 用户ID
     */
    bindLogin(userId: string): void;
    /**
     * 获取历史标识符
     * @param userId 用户ID
     * @returns 历史标识符
     */
    getHistoricalIdentifier(userId: string): string | null;
    /**
     * 获取哈希详情
     * @param experimentId 实验ID
     * @param experiments 实验配置列表
     * @returns 哈希详情
     */
    getHashDetails(experimentId: string, experiments: Experiment[]): HashResult | null;
}
//# sourceMappingURL=DecisionEngine.d.ts.map
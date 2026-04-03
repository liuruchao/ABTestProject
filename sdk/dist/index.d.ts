/**
 * A/B测试SDK主类
 * 提供流量决策、缓存管理和页面快照功能
 */
import { Experiment, ExperimentResult, UserContext, DecisionConfig, PageSnapshot } from './types';
export declare class ABTestSDK {
    /** 决策引擎实例 */
    private decisionEngine;
    /** 缓存管理器实例 */
    private cacheManager;
    /** 快照管理器实例 */
    private snapshotManager;
    /** SDK初始化状态 */
    private isInitialized;
    /** API服务实例 */
    private apiService;
    /** 实验数据 */
    private experiments;
    /** 当前页面路由 */
    private currentRoute;
    /**
     * 构造函数
     * @param config 配置选项
     */
    constructor(config?: DecisionConfig);
    /**
     * 初始化SDK
     * @param userContext 用户上下文
     * @param route 页面路由
     * @returns Promise
     */
    initialize(userContext: UserContext, route?: string): Promise<void>;
    /**
     * 从后端获取实验数据
     * @param sync 是否同步获取（无缓存时使用）
     * @param route 页面路由（可选，默认使用初始化时的路由）
     * @returns Promise
     */
    fetchExperiments(sync?: boolean, route?: string): Promise<void>;
    /**
     * 异步更新实验数据
     * @param route 页面路由
     * @private
     */
    private updateExperimentsAsync;
    /**
     * 更新用户上下文
     * @param context 用户上下文部分更新
     */
    updateUserContext(context: Partial<UserContext>): void;
    /**
     * 页面进入
     * @param route 页面路由
     * @param experiments 实验配置列表（可选，默认使用从后端获取的实验数据）
     * @returns 实验结果列表
     */
    enterPage(route: string, experiments?: Experiment[]): ExperimentResult[];
    /**
     * 获取当前实验数据
     * @returns 实验配置列表
     */
    getExperiments(): Experiment[];
    /**
     * 刷新实验数据
     * @param route 页面路由（可选，默认使用初始化时的路由）
     * @returns Promise
     */
    refreshExperiments(route?: string): Promise<void>;
    /**
     * 页面退出
     * @param route 页面路由
     */
    exitPage(route: string): void;
    /**
     * 获取实验变量
     * @param experimentId 实验ID
     * @param variableName 变量名
     * @param defaultValue 默认值
     * @returns 变量值
     */
    getVariable<T = any>(experimentId: string, variableName: string, defaultValue?: T): T;
    /**
     * 获取实验结果
     * @param experimentId 实验ID
     * @returns 实验结果
     */
    getExperimentResult(experimentId: string): ExperimentResult | null;
    /**
     * 判断是否为对照组
     * @param experimentId 实验ID
     * @returns 是否为对照组
     */
    isControlGroup(experimentId: string): boolean;
    /**
     * 获取当前快照
     * @returns 页面快照
     */
    getCurrentSnapshot(): PageSnapshot | null;
    /**
     * 获取实验上下文
     * @returns 实验上下文
     */
    getExperimentContext(): Record<string, string>;
    /**
     * 获取所有活跃实验
     * @returns 实验ID列表
     */
    getAllActiveExperiments(): string[];
    /**
     * 缓存实验配置
     * @param experiments 实验配置列表
     */
    cacheExperiments(experiments: Experiment[]): void;
    /**
     * 获取缓存的实验配置
     * @returns 实验配置列表
     */
    getCachedExperiments(): Experiment[] | null;
    /**
     * 刷新缓存
     * @param experiments 实验配置列表
     */
    refreshCache(experiments: Experiment[]): void;
    /**
     * 清除缓存
     */
    clearCache(): void;
    /**
     * 清理过期缓存
     */
    cleanupExpiredCache(): void;
    /**
     * 获取哈希详情
     * @param experimentId 实验ID
     * @param experiments 实验配置列表
     * @returns 哈希详情
     */
    getHashDetails(experimentId: string, experiments: Experiment[]): import("./types").HashResult | null;
    /**
     * 获取当前标识符
     * @returns 当前标识符
     */
    getCurrentIdentifier(): string;
    /**
     * 检查SDK是否就绪
     * @returns 是否就绪
     */
    isReady(): boolean;
}
export * from './types';
export { DecisionEngine } from './core/DecisionEngine';
export { CacheManager } from './cache/CacheManager';
export { SnapshotManager } from './core/SnapshotManager';
//# sourceMappingURL=index.d.ts.map
/**
 * 缓存管理器类
 * 负责三级缓存策略的实现
 */
import { Experiment, ExperimentResult, CacheConfig, PageSnapshot } from '../types';
export declare class CacheManager {
    /** 缓存配置 */
    private config;
    /** 内存缓存 */
    private memoryCache;
    /** 页面快照缓存 */
    private pageSnapshots;
    /**
     * 构造函数
     * @param config 缓存配置
     */
    constructor(config?: Partial<CacheConfig>);
    /**
     * 设置缓存
     * @param key 缓存键
     * @param value 缓存值
     */
    set(key: string, value: any): void;
    /**
     * 获取缓存
     * @param key 缓存键
     * @returns 缓存值
     */
    get<T>(key: string): T | null;
    /**
     * 移除缓存
     * @param key 缓存键
     */
    remove(key: string): void;
    /**
     * 清除所有缓存
     */
    clear(): void;
    /**
     * 缓存实验配置
     * @param experiments 实验配置列表
     * @param route 页面路由（可选）
     */
    cacheExperiments(experiments: Experiment[], route?: string): void;
    /**
     * 获取缓存的实验配置
     * @param route 页面路由（可选）
     * @returns 实验配置列表
     */
    getCachedExperiments(route?: string): Experiment[] | null;
    /**
     * 缓存实验结果
     * @param experimentId 实验ID
     * @param result 实验结果
     */
    cacheExperimentResult(experimentId: string, result: ExperimentResult): void;
    /**
     * 获取缓存的实验结果
     * @param experimentId 实验ID
     * @returns 实验结果
     */
    getCachedExperimentResult(experimentId: string): ExperimentResult | null;
    /**
     * 缓存用户绑定
     * @param userId 用户ID
     * @param deviceId 设备ID
     */
    cacheUserBinding(userId: string, deviceId: string): void;
    /**
     * 获取缓存的用户绑定
     * @param userId 用户ID
     * @returns 设备ID
     */
    getCachedUserBinding(userId: string): string | null;
    /**
     * 创建页面快照
     * @param route 页面路由
     * @param results 实验结果列表
     * @returns 页面快照
     */
    createPageSnapshot(route: string, results: ExperimentResult[]): PageSnapshot;
    /**
     * 获取页面快照
     * @param route 页面路由
     * @returns 页面快照
     */
    getPageSnapshot(route: string): PageSnapshot | null;
    /**
     * 清除页面快照
     * @param route 页面路由
     */
    clearPageSnapshot(route: string): void;
    /**
     * 清除所有快照
     */
    clearAllSnapshots(): void;
    /**
     * 清理过期缓存
     */
    cleanupExpired(): void;
}
//# sourceMappingURL=CacheManager.d.ts.map
/**
 * 快照管理器类
 * 负责页面快照的创建、管理和防UI抖动
 */
import { Experiment, ExperimentResult, PageSnapshot } from '../types';
import { DecisionEngine } from './DecisionEngine';
import { CacheManager } from '../cache/CacheManager';
export declare class SnapshotManager {
    /** 决策引擎实例 */
    private decisionEngine;
    /** 缓存管理器实例 */
    private cacheManager;
    /** 当前路由 */
    private currentRoute;
    /** 当前快照 */
    private currentSnapshot;
    /**
     * 构造函数
     * @param decisionEngine 决策引擎实例
     * @param cacheManager 缓存管理器实例
     */
    constructor(decisionEngine: DecisionEngine, cacheManager: CacheManager);
    /**
     * 页面进入
     * @param route 页面路由
     * @param experiments 实验配置列表
     * @returns 实验结果列表
     */
    enterPage(route: string, experiments: Experiment[]): ExperimentResult[];
    /**
     * 页面退出
     * @param route 页面路由
     */
    exitPage(route: string): void;
    /**
     * 获取当前快照
     * @returns 页面快照
     */
    getCurrentSnapshot(): PageSnapshot | null;
    /**
     * 获取当前实验结果
     * @returns 实验结果列表
     */
    getCurrentResults(): ExperimentResult[];
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
     * 刷新快照
     * @param route 页面路由
     * @param experiments 实验配置列表
     * @returns 实验结果列表
     */
    refreshSnapshot(route: string, experiments: Experiment[]): ExperimentResult[];
    /**
     * 使快照失效
     * @param route 页面路由
     */
    invalidateSnapshot(route: string): void;
    /**
     * 获取所有活跃实验
     * @returns 实验ID列表
     */
    getAllActiveExperiments(): string[];
    /**
     * 获取实验上下文
     * @returns 实验上下文
     */
    getExperimentContext(): Record<string, string>;
    /**
     * 导出快照
     * @returns 页面快照
     */
    exportSnapshot(): PageSnapshot | null;
    /**
     * 导入快照
     * @param snapshot 页面快照
     */
    importSnapshot(snapshot: PageSnapshot): void;
}
//# sourceMappingURL=SnapshotManager.d.ts.map
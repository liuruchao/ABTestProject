/**
 * 类型定义
 */
/**
 * 实验配置接口
 */
export interface Experiment {
    id: string;
    name: string;
    description?: string;
    status: 'draft' | 'running' | 'paused' | 'ended';
    layer: 'ui' | 'strategy' | 'algorithm' | 'marketing';
    trafficRatio: number;
    mutexGroupId?: string;
    priority: number;
    groups: ExperimentGroup[];
    routeRules: RouteRule[];
    createdAt: number;
    updatedAt: number;
}
/**
 * 实验组接口
 */
export interface ExperimentGroup {
    id: string;
    experimentId: string;
    name: string;
    ratio: number;
    variables: Record<string, any>;
    isControl: boolean;
}
/**
 * 路由规则接口
 */
export interface RouteRule {
    id: string;
    experimentId: string;
    type: 'exact' | 'wildcard' | 'hierarchy';
    pattern: string;
}
/**
 * 用户上下文接口
 * 登录状态由是否传入userId来判断，传入userId则表示已登录
 */
export interface UserContext {
    userId?: string;
    deviceId: string;
}
/**
 * 实验结果接口
 */
export interface ExperimentResult {
    experimentId: string;
    groupName: string;
    groupId: string;
    variables: Record<string, any>;
    isControl: boolean;
    hashValue: number;
}
/**
 * 页面快照接口
 */
export interface PageSnapshot {
    route: string;
    results: ExperimentResult[];
    timestamp: number;
}
/**
 * 缓存配置接口
 */
export interface CacheConfig {
    memoryCacheExpire: number;
    localStorageExpire: number;
    enableMemoryCache: boolean;
    enableLocalStorage: boolean;
}
/**
 * 决策配置接口
 */
export interface DecisionConfig {
    cache?: Partial<CacheConfig>;
    enableSnapshot?: boolean;
    enableAutoLoginBinding?: boolean;
}
/**
 * 哈希结果接口
 */
export interface HashResult {
    value: number;
    groupId: string;
    groupName: string;
}
//# sourceMappingURL=index.d.ts.map
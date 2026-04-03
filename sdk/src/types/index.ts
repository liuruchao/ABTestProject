/**
 * 类型定义
 */

/**
 * 实验配置接口
 */
export interface Experiment {
  id: string;                 // 实验ID
  name: string;               // 实验名称
  description?: string;        // 实验描述
  status: 'draft' | 'running' | 'paused' | 'ended'; // 实验状态
  layer: 'ui' | 'strategy' | 'algorithm' | 'marketing'; // 实验层级
  trafficRatio: number;        // 流量比例
  mutexGroupId?: string;       // 互斥组ID
  priority: number;            // 优先级
  groups: ExperimentGroup[];   // 实验组列表
  routeRules: RouteRule[];     // 路由规则
  createdAt: number;           // 创建时间
  updatedAt: number;           // 更新时间
}

/**
 * 实验组接口
 */
export interface ExperimentGroup {
  id: string;                 // 实验组ID
  experimentId: string;        // 实验ID
  name: string;               // 实验组名称
  ratio: number;               // 流量比例
  variables: Record<string, any>; // 变量配置
  isControl: boolean;          // 是否为对照组
}

/**
 * 路由规则接口
 */
export interface RouteRule {
  id: string;                 // 规则ID
  experimentId: string;        // 实验ID
  type: 'exact' | 'wildcard' | 'hierarchy'; // 匹配类型
  pattern: string;             // 匹配模式
}

/**
 * 用户上下文接口
 * 登录状态由是否传入userId来判断，传入userId则表示已登录
 */
export interface UserContext {
  userId?: string;             // 用户ID（传入则表示已登录）
  deviceId: string;            // 设备ID
}

/**
 * 实验结果接口
 */
export interface ExperimentResult {
  experimentId: string;        // 实验ID
  groupName: string;           // 实验组名称
  groupId: string;             // 实验组ID
  variables: Record<string, any>; // 变量配置
  isControl: boolean;          // 是否为对照组
  hashValue: number;           // 哈希值（用于调试）
}

/**
 * 页面快照接口
 */
export interface PageSnapshot {
  route: string;               // 页面路由
  results: ExperimentResult[];  // 实验结果列表
  timestamp: number;           // 快照时间戳
}

/**
 * 缓存配置接口
 */
export interface CacheConfig {
  memoryCacheExpire: number;   // 内存缓存过期时间
  localStorageExpire: number;  // 本地存储过期时间
  enableMemoryCache: boolean;  // 是否启用内存缓存
  enableLocalStorage: boolean; // 是否启用本地存储
}

/**
 * 决策配置接口
 */
export interface DecisionConfig {
  cache?: Partial<CacheConfig>; // 缓存配置
  enableSnapshot?: boolean;     // 是否启用快照
  enableAutoLoginBinding?: boolean; // 是否启用自动登录绑定
}

/**
 * 哈希结果接口
 */
export interface HashResult {
  value: number;               // 哈希值
  groupId: string;             // 实验组ID
  groupName: string;           // 实验组名称
}
/**
 * 快照管理器类
 * 负责页面快照的创建、管理和防UI抖动
 */
import { Experiment, ExperimentResult, PageSnapshot, UserContext } from '../types';
import { DecisionEngine } from './DecisionEngine';
import { CacheManager } from '../cache/CacheManager';

export class SnapshotManager {
  /** 决策引擎实例 */
  private decisionEngine: DecisionEngine;
  /** 缓存管理器实例 */
  private cacheManager: CacheManager;
  /** 当前路由 */
  private currentRoute: string | null = null;
  /** 当前快照 */
  private currentSnapshot: PageSnapshot | null = null;

  /**
   * 构造函数
   * @param decisionEngine 决策引擎实例
   * @param cacheManager 缓存管理器实例
   */
  constructor(decisionEngine: DecisionEngine, cacheManager: CacheManager) {
    this.decisionEngine = decisionEngine;
    this.cacheManager = cacheManager;
  }

  /**
   * 页面进入
   * @param route 页面路由
   * @param experiments 实验配置列表
   * @returns 实验结果列表
   */
  enterPage(route: string, experiments: Experiment[]): ExperimentResult[] {
    console.log('=== SnapshotManager.enterPage 调用 ===');
    console.log('页面路由:', route);
    console.log('实验数量:', experiments.length);
    
    this.currentRoute = route;

    const cachedSnapshot = this.cacheManager.getPageSnapshot(route);
    console.log('缓存快照:', cachedSnapshot ? '存在' : '不存在');
    
    if (cachedSnapshot) {
      console.log('使用缓存快照，跳过决策引擎');
      this.currentSnapshot = cachedSnapshot;
      return cachedSnapshot.results;
    }

    console.log('没有缓存，调用决策引擎进行决策');
    const results = this.decisionEngine.makeDecisions(experiments);
    console.log('决策引擎返回结果数量:', results.length);
    
    this.currentSnapshot = this.cacheManager.createPageSnapshot(route, results);
    console.log('=== SnapshotManager.enterPage 结束 ===\n');

    return results;
  }

  /**
   * 页面退出
   * @param route 页面路由
   */
  exitPage(route: string): void {
    if (this.currentRoute === route) {
      this.currentRoute = null;
      this.currentSnapshot = null;
    }
  }

  /**
   * 获取当前快照
   * @returns 页面快照
   */
  getCurrentSnapshot(): PageSnapshot | null {
    return this.currentSnapshot;
  }

  /**
   * 获取当前实验结果
   * @returns 实验结果列表
   */
  getCurrentResults(): ExperimentResult[] {
    return this.currentSnapshot?.results || [];
  }

  /**
   * 获取实验变量
   * @param experimentId 实验ID
   * @param variableName 变量名
   * @param defaultValue 默认值
   * @returns 变量值
   */
  getVariable<T = any>(experimentId: string, variableName: string, defaultValue?: T): T {
    const results = this.getCurrentResults();
    const result = results.find(r => r.experimentId === experimentId);

    if (result && result.variables && variableName in result.variables) {
      return result.variables[variableName] as T;
    }

    return defaultValue as T;
  }

  /**
   * 获取实验结果
   * @param experimentId 实验ID
   * @returns 实验结果
   */
  getExperimentResult(experimentId: string): ExperimentResult | null {
    const results = this.getCurrentResults();
    return results.find(r => r.experimentId === experimentId) || null;
  }

  /**
   * 判断是否为对照组
   * @param experimentId 实验ID
   * @returns 是否为对照组
   */
  isControlGroup(experimentId: string): boolean {
    const result = this.getExperimentResult(experimentId);
    return result ? result.isControl : true;
  }

  /**
   * 刷新快照
   * @param route 页面路由
   * @param experiments 实验配置列表
   * @returns 实验结果列表
   */
  refreshSnapshot(route: string, experiments: Experiment[]): ExperimentResult[] {
    if (this.currentRoute !== route) {
      return this.getCurrentResults();
    }

    const results = this.decisionEngine.makeDecisions(experiments);
    this.currentSnapshot = this.cacheManager.createPageSnapshot(route, results);

    return results;
  }

  /**
   * 使快照失效
   * @param route 页面路由
   */
  invalidateSnapshot(route: string): void {
    this.cacheManager.clearPageSnapshot(route);
    if (this.currentRoute === route) {
      this.currentSnapshot = null;
    }
  }

  /**
   * 获取所有活跃实验
   * @returns 实验ID列表
   */
  getAllActiveExperiments(): string[] {
    const results = this.getCurrentResults();
    return results.map(r => r.experimentId);
  }

  /**
   * 获取实验上下文
   * @returns 实验上下文
   */
  getExperimentContext(): Record<string, string> {
    const results = this.getCurrentResults();
    const context: Record<string, string> = {};

    results.forEach(result => {
      context[result.experimentId] = `${result.groupName}:${result.groupId}`;
    });

    return context;
  }

  /**
   * 导出快照
   * @returns 页面快照
   */
  exportSnapshot(): PageSnapshot | null {
    return this.currentSnapshot ? { ...this.currentSnapshot } : null;
  }

  /**
   * 导入快照
   * @param snapshot 页面快照
   */
  importSnapshot(snapshot: PageSnapshot): void {
    if (snapshot && snapshot.route) {
      this.currentRoute = snapshot.route;
      this.currentSnapshot = snapshot;
      this.cacheManager.createPageSnapshot(snapshot.route, snapshot.results);
    }
  }
}
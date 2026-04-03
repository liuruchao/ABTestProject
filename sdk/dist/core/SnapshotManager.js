"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnapshotManager = void 0;
class SnapshotManager {
    /**
     * 构造函数
     * @param decisionEngine 决策引擎实例
     * @param cacheManager 缓存管理器实例
     */
    constructor(decisionEngine, cacheManager) {
        /** 当前路由 */
        this.currentRoute = null;
        /** 当前快照 */
        this.currentSnapshot = null;
        this.decisionEngine = decisionEngine;
        this.cacheManager = cacheManager;
    }
    /**
     * 页面进入
     * @param route 页面路由
     * @param experiments 实验配置列表
     * @returns 实验结果列表
     */
    enterPage(route, experiments) {
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
    exitPage(route) {
        if (this.currentRoute === route) {
            this.currentRoute = null;
            this.currentSnapshot = null;
        }
    }
    /**
     * 获取当前快照
     * @returns 页面快照
     */
    getCurrentSnapshot() {
        return this.currentSnapshot;
    }
    /**
     * 获取当前实验结果
     * @returns 实验结果列表
     */
    getCurrentResults() {
        return this.currentSnapshot?.results || [];
    }
    /**
     * 获取实验变量
     * @param experimentId 实验ID
     * @param variableName 变量名
     * @param defaultValue 默认值
     * @returns 变量值
     */
    getVariable(experimentId, variableName, defaultValue) {
        const results = this.getCurrentResults();
        const result = results.find(r => r.experimentId === experimentId);
        if (result && result.variables && variableName in result.variables) {
            return result.variables[variableName];
        }
        return defaultValue;
    }
    /**
     * 获取实验结果
     * @param experimentId 实验ID
     * @returns 实验结果
     */
    getExperimentResult(experimentId) {
        const results = this.getCurrentResults();
        return results.find(r => r.experimentId === experimentId) || null;
    }
    /**
     * 判断是否为对照组
     * @param experimentId 实验ID
     * @returns 是否为对照组
     */
    isControlGroup(experimentId) {
        const result = this.getExperimentResult(experimentId);
        return result ? result.isControl : true;
    }
    /**
     * 刷新快照
     * @param route 页面路由
     * @param experiments 实验配置列表
     * @returns 实验结果列表
     */
    refreshSnapshot(route, experiments) {
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
    invalidateSnapshot(route) {
        this.cacheManager.clearPageSnapshot(route);
        if (this.currentRoute === route) {
            this.currentSnapshot = null;
        }
    }
    /**
     * 获取所有活跃实验
     * @returns 实验ID列表
     */
    getAllActiveExperiments() {
        const results = this.getCurrentResults();
        return results.map(r => r.experimentId);
    }
    /**
     * 获取实验上下文
     * @returns 实验上下文
     */
    getExperimentContext() {
        const results = this.getCurrentResults();
        const context = {};
        results.forEach(result => {
            context[result.experimentId] = `${result.groupName}:${result.groupId}`;
        });
        return context;
    }
    /**
     * 导出快照
     * @returns 页面快照
     */
    exportSnapshot() {
        return this.currentSnapshot ? { ...this.currentSnapshot } : null;
    }
    /**
     * 导入快照
     * @param snapshot 页面快照
     */
    importSnapshot(snapshot) {
        if (snapshot && snapshot.route) {
            this.currentRoute = snapshot.route;
            this.currentSnapshot = snapshot;
            this.cacheManager.createPageSnapshot(snapshot.route, snapshot.results);
        }
    }
}
exports.SnapshotManager = SnapshotManager;
//# sourceMappingURL=SnapshotManager.js.map
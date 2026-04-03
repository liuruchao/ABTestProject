"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnapshotManager = exports.CacheManager = exports.DecisionEngine = exports.ABTestSDK = void 0;
const DecisionEngine_1 = require("./core/DecisionEngine");
const CacheManager_1 = require("./cache/CacheManager");
const SnapshotManager_1 = require("./core/SnapshotManager");
/**
 * API服务类
 * 负责与后端API通信
 */
class ApiService {
    /**
     * 获取实验列表
     * @param route 页面路由
     * @returns 实验列表
     */
    async getExperiments(route) {
        try {
            let url = '/api/experiment';
            if (route) {
                // 使用新的接口获取根据路由匹配的实验数据
                url = `/api/experiment/by-route?route=${encodeURIComponent(route)}`;
            }
            console.log('发起API请求:', url);
            const response = await fetch(url);
            console.log('API响应状态:', response.status);
            if (!response.ok) {
                const errorText = await response.text();
                console.error('API请求失败:', response.status, errorText);
                throw new Error(`API请求失败: ${response.status} - ${errorText}`);
            }
            const data = await response.json();
            console.log('API响应数据:', data);
            return data;
        }
        catch (error) {
            console.error('获取实验数据失败:', error);
            return [];
        }
    }
}
class ABTestSDK {
    /**
     * 构造函数
     * @param config 配置选项
     */
    constructor(config = {}) {
        /** SDK初始化状态 */
        this.isInitialized = false;
        /** 实验数据 */
        this.experiments = [];
        this.cacheManager = new CacheManager_1.CacheManager(config.cache);
        this.decisionEngine = new DecisionEngine_1.DecisionEngine({
            deviceId: ''
        });
        this.snapshotManager = new SnapshotManager_1.SnapshotManager(this.decisionEngine, this.cacheManager);
        this.apiService = new ApiService();
    }
    /**
     * 初始化SDK
     * @param userContext 用户上下文
     * @param route 页面路由
     * @returns Promise
     */
    async initialize(userContext, route) {
        this.decisionEngine = new DecisionEngine_1.DecisionEngine(userContext);
        // 更新快照管理器中的决策引擎实例
        this.snapshotManager = new SnapshotManager_1.SnapshotManager(this.decisionEngine, this.cacheManager);
        this.currentRoute = route;
        if (userContext.userId) {
            const historicalDeviceId = this.cacheManager.getCachedUserBinding(userContext.userId);
            if (historicalDeviceId) {
                this.decisionEngine.bindLogin(userContext.userId);
            }
        }
        // 从后端获取实验数据，无缓存时同步获取
        await this.fetchExperiments(true);
        this.isInitialized = true;
    }
    /**
     * 从后端获取实验数据
     * @param sync 是否同步获取（无缓存时使用）
     * @param route 页面路由（可选，默认使用初始化时的路由）
     * @returns Promise
     */
    async fetchExperiments(sync = false, route) {
        const currentRoute = route || this.currentRoute;
        if (sync) {
            // 强制同步获取数据，不使用缓存
            try {
                const experiments = await this.apiService.getExperiments(currentRoute);
                this.experiments = experiments;
                this.cacheManager.cacheExperiments(experiments, currentRoute);
            }
            catch (error) {
                console.error('获取实验数据失败:', error);
                this.experiments = [];
            }
        }
        else {
            // 检查缓存数据
            const cachedExperiments = this.cacheManager.getCachedExperiments(currentRoute);
            if (cachedExperiments) {
                // 有缓存数据，直接使用，并异步更新
                this.experiments = cachedExperiments;
                this.updateExperimentsAsync(currentRoute);
            }
            else {
                // 无缓存数据，同步调用接口获取
                try {
                    const experiments = await this.apiService.getExperiments(currentRoute);
                    this.experiments = experiments;
                    this.cacheManager.cacheExperiments(experiments, currentRoute);
                }
                catch (error) {
                    console.error('获取实验数据失败:', error);
                    this.experiments = [];
                }
            }
        }
    }
    /**
     * 异步更新实验数据
     * @param route 页面路由
     * @private
     */
    async updateExperimentsAsync(route) {
        try {
            const currentRoute = route || this.currentRoute;
            const experiments = await this.apiService.getExperiments(currentRoute);
            if (experiments.length > 0) {
                this.experiments = experiments;
                this.cacheManager.cacheExperiments(experiments, currentRoute);
            }
        }
        catch (error) {
            console.error('异步更新实验数据失败:', error);
            // 异步更新失败不影响当前使用的缓存数据
        }
    }
    /**
     * 更新用户上下文
     * @param context 用户上下文部分更新
     */
    updateUserContext(context) {
        if (!this.isInitialized) {
            throw new Error('SDK未初始化，请先调用initialize()方法');
        }
        const previousUserId = this.decisionEngine['userContext'].userId;
        const previousDeviceId = this.decisionEngine['userContext'].deviceId;
        const newUserId = context.userId;
        const newDeviceId = context.deviceId;
        this.decisionEngine.updateUserContext(context);
        // 检查用户信息是否发生变化
        const userInfoChanged = newUserId !== previousUserId ||
            (newDeviceId && newDeviceId !== previousDeviceId);
        if (userInfoChanged) {
            console.log('用户信息发生变化，使快照失效');
            // 使当前路由的快照失效
            if (this.currentRoute) {
                this.snapshotManager.invalidateSnapshot(this.currentRoute);
            }
        }
        if (newUserId && newUserId !== previousUserId) {
            this.cacheManager.cacheUserBinding(newUserId, this.decisionEngine['userContext'].deviceId);
            this.decisionEngine.bindLogin(newUserId);
        }
    }
    /**
     * 页面进入
     * @param route 页面路由
     * @param experiments 实验配置列表（可选，默认使用从后端获取的实验数据）
     * @returns 实验结果列表
     */
    enterPage(route, experiments) {
        if (!this.isInitialized) {
            throw new Error('SDK未初始化，请先调用initialize()方法');
        }
        // 更新当前路由
        this.currentRoute = route;
        const experimentsToUse = experiments || this.experiments;
        return this.snapshotManager.enterPage(route, experimentsToUse);
    }
    /**
     * 获取当前实验数据
     * @returns 实验配置列表
     */
    getExperiments() {
        return this.experiments;
    }
    /**
     * 刷新实验数据
     * @param route 页面路由（可选，默认使用初始化时的路由）
     * @returns Promise
     */
    async refreshExperiments(route) {
        // 强制同步获取最新数据，不使用缓存
        await this.fetchExperiments(true, route);
    }
    /**
     * 页面退出
     * @param route 页面路由
     */
    exitPage(route) {
        if (!this.isInitialized) {
            throw new Error('SDK未初始化，请先调用initialize()方法');
        }
        this.snapshotManager.exitPage(route);
    }
    /**
     * 获取实验变量
     * @param experimentId 实验ID
     * @param variableName 变量名
     * @param defaultValue 默认值
     * @returns 变量值
     */
    getVariable(experimentId, variableName, defaultValue) {
        if (!this.isInitialized) {
            throw new Error('SDK未初始化，请先调用initialize()方法');
        }
        return this.snapshotManager.getVariable(experimentId, variableName, defaultValue);
    }
    /**
     * 获取实验结果
     * @param experimentId 实验ID
     * @returns 实验结果
     */
    getExperimentResult(experimentId) {
        if (!this.isInitialized) {
            throw new Error('SDK未初始化，请先调用initialize()方法');
        }
        return this.snapshotManager.getExperimentResult(experimentId);
    }
    /**
     * 判断是否为对照组
     * @param experimentId 实验ID
     * @returns 是否为对照组
     */
    isControlGroup(experimentId) {
        if (!this.isInitialized) {
            throw new Error('SDK未初始化，请先调用initialize()方法');
        }
        return this.snapshotManager.isControlGroup(experimentId);
    }
    /**
     * 获取当前快照
     * @returns 页面快照
     */
    getCurrentSnapshot() {
        if (!this.isInitialized) {
            throw new Error('SDK未初始化，请先调用initialize()方法');
        }
        return this.snapshotManager.getCurrentSnapshot();
    }
    /**
     * 获取实验上下文
     * @returns 实验上下文
     */
    getExperimentContext() {
        if (!this.isInitialized) {
            throw new Error('SDK未初始化，请先调用initialize()方法');
        }
        return this.snapshotManager.getExperimentContext();
    }
    /**
     * 获取所有活跃实验
     * @returns 实验ID列表
     */
    getAllActiveExperiments() {
        if (!this.isInitialized) {
            throw new Error('SDK未初始化，请先调用initialize()方法');
        }
        return this.snapshotManager.getAllActiveExperiments();
    }
    /**
     * 缓存实验配置
     * @param experiments 实验配置列表
     */
    cacheExperiments(experiments) {
        this.cacheManager.cacheExperiments(experiments);
    }
    /**
     * 获取缓存的实验配置
     * @returns 实验配置列表
     */
    getCachedExperiments() {
        return this.cacheManager.getCachedExperiments();
    }
    /**
     * 刷新缓存
     * @param experiments 实验配置列表
     */
    refreshCache(experiments) {
        this.cacheManager.cacheExperiments(experiments);
    }
    /**
     * 清除缓存
     */
    clearCache() {
        this.cacheManager.clear();
        this.snapshotManager['currentSnapshot'] = null;
    }
    /**
     * 清理过期缓存
     */
    cleanupExpiredCache() {
        this.cacheManager.cleanupExpired();
    }
    /**
     * 获取哈希详情
     * @param experimentId 实验ID
     * @param experiments 实验配置列表
     * @returns 哈希详情
     */
    getHashDetails(experimentId, experiments) {
        if (!this.isInitialized) {
            throw new Error('SDK未初始化，请先调用initialize()方法');
        }
        return this.decisionEngine.getHashDetails(experimentId, experiments);
    }
    /**
     * 获取当前标识符
     * @returns 当前标识符
     */
    getCurrentIdentifier() {
        if (!this.isInitialized) {
            throw new Error('SDK未初始化，请先调用initialize()方法');
        }
        return this.decisionEngine.getCurrentIdentifier();
    }
    /**
     * 检查SDK是否就绪
     * @returns 是否就绪
     */
    isReady() {
        return this.isInitialized;
    }
}
exports.ABTestSDK = ABTestSDK;
__exportStar(require("./types"), exports);
var DecisionEngine_2 = require("./core/DecisionEngine");
Object.defineProperty(exports, "DecisionEngine", { enumerable: true, get: function () { return DecisionEngine_2.DecisionEngine; } });
var CacheManager_2 = require("./cache/CacheManager");
Object.defineProperty(exports, "CacheManager", { enumerable: true, get: function () { return CacheManager_2.CacheManager; } });
var SnapshotManager_2 = require("./core/SnapshotManager");
Object.defineProperty(exports, "SnapshotManager", { enumerable: true, get: function () { return SnapshotManager_2.SnapshotManager; } });
//# sourceMappingURL=index.js.map
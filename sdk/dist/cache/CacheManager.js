"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheManager = void 0;
const DEFAULT_CACHE_CONFIG = {
    memoryCacheExpire: 5 * 60 * 1000, // 内存缓存过期时间（5分钟）
    localStorageExpire: 24 * 60 * 60 * 1000, // 本地存储过期时间（24小时）
    enableMemoryCache: true,
    enableLocalStorage: true
};
class CacheManager {
    /**
     * 构造函数
     * @param config 缓存配置
     */
    constructor(config = {}) {
        this.config = { ...DEFAULT_CACHE_CONFIG, ...config };
        this.memoryCache = new Map();
        this.pageSnapshots = new Map();
    }
    /**
     * 设置缓存
     * @param key 缓存键
     * @param value 缓存值
     */
    set(key, value) {
        if (this.config.enableMemoryCache) {
            this.memoryCache.set(key, {
                data: value,
                timestamp: Date.now()
            });
        }
        if (this.config.enableLocalStorage && typeof localStorage !== 'undefined') {
            try {
                const cacheItem = {
                    data: value,
                    timestamp: Date.now()
                };
                localStorage.setItem(`ab_test_${key}`, JSON.stringify(cacheItem));
            }
            catch (error) {
                console.warn('Failed to write to localStorage:', error);
            }
        }
    }
    /**
     * 获取缓存
     * @param key 缓存键
     * @returns 缓存值
     */
    get(key) {
        if (this.config.enableMemoryCache) {
            const memoryItem = this.memoryCache.get(key);
            if (memoryItem && Date.now() - memoryItem.timestamp < this.config.memoryCacheExpire) {
                return memoryItem.data;
            }
        }
        if (this.config.enableLocalStorage && typeof localStorage !== 'undefined') {
            try {
                const storedItem = localStorage.getItem(`ab_test_${key}`);
                if (storedItem) {
                    const parsedItem = JSON.parse(storedItem);
                    if (Date.now() - parsedItem.timestamp < this.config.localStorageExpire) {
                        return parsedItem.data;
                    }
                }
            }
            catch (error) {
                console.warn('Failed to read from localStorage:', error);
            }
        }
        return null;
    }
    /**
     * 移除缓存
     * @param key 缓存键
     */
    remove(key) {
        this.memoryCache.delete(key);
        if (this.config.enableLocalStorage && typeof localStorage !== 'undefined') {
            try {
                localStorage.removeItem(`ab_test_${key}`);
            }
            catch (error) {
                console.warn('Failed to remove from localStorage:', error);
            }
        }
    }
    /**
     * 清除所有缓存
     */
    clear() {
        this.memoryCache.clear();
        if (this.config.enableLocalStorage && typeof localStorage !== 'undefined') {
            try {
                const keys = Object.keys(localStorage);
                keys.forEach(key => {
                    if (key.startsWith('ab_test_')) {
                        localStorage.removeItem(key);
                    }
                });
            }
            catch (error) {
                console.warn('Failed to clear localStorage:', error);
            }
        }
    }
    /**
     * 缓存实验配置
     * @param experiments 实验配置列表
     * @param route 页面路由（可选）
     */
    cacheExperiments(experiments, route) {
        const key = route ? `experiments_${route}` : 'experiments';
        this.set(key, experiments);
    }
    /**
     * 获取缓存的实验配置
     * @param route 页面路由（可选）
     * @returns 实验配置列表
     */
    getCachedExperiments(route) {
        const key = route ? `experiments_${route}` : 'experiments';
        return this.get('experiments') || this.get(key);
    }
    /**
     * 缓存实验结果
     * @param experimentId 实验ID
     * @param result 实验结果
     */
    cacheExperimentResult(experimentId, result) {
        this.set(`result_${experimentId}`, result);
    }
    /**
     * 获取缓存的实验结果
     * @param experimentId 实验ID
     * @returns 实验结果
     */
    getCachedExperimentResult(experimentId) {
        return this.get(`result_${experimentId}`);
    }
    /**
     * 缓存用户绑定
     * @param userId 用户ID
     * @param deviceId 设备ID
     */
    cacheUserBinding(userId, deviceId) {
        this.set(`binding_${userId}`, deviceId);
    }
    /**
     * 获取缓存的用户绑定
     * @param userId 用户ID
     * @returns 设备ID
     */
    getCachedUserBinding(userId) {
        return this.get(`binding_${userId}`);
    }
    /**
     * 创建页面快照
     * @param route 页面路由
     * @param results 实验结果列表
     * @returns 页面快照
     */
    createPageSnapshot(route, results) {
        const snapshot = {
            route,
            results,
            timestamp: Date.now()
        };
        this.pageSnapshots.set(route, snapshot);
        this.set(`snapshot_${route}`, snapshot);
        return snapshot;
    }
    /**
     * 获取页面快照
     * @param route 页面路由
     * @returns 页面快照
     */
    getPageSnapshot(route) {
        const memorySnapshot = this.pageSnapshots.get(route);
        if (memorySnapshot) {
            return memorySnapshot;
        }
        return this.get(`snapshot_${route}`);
    }
    /**
     * 清除页面快照
     * @param route 页面路由
     */
    clearPageSnapshot(route) {
        this.pageSnapshots.delete(route);
        this.remove(`snapshot_${route}`);
    }
    /**
     * 清除所有快照
     */
    clearAllSnapshots() {
        this.pageSnapshots.clear();
        if (this.config.enableLocalStorage && typeof localStorage !== 'undefined') {
            try {
                const keys = Object.keys(localStorage);
                keys.forEach(key => {
                    if (key.startsWith('ab_test_snapshot_')) {
                        localStorage.removeItem(key);
                    }
                });
            }
            catch (error) {
                console.warn('Failed to clear snapshots from localStorage:', error);
            }
        }
    }
    /**
     * 清理过期缓存
     */
    cleanupExpired() {
        const now = Date.now();
        if (this.config.enableMemoryCache) {
            for (const [key, value] of this.memoryCache.entries()) {
                if (now - value.timestamp >= this.config.memoryCacheExpire) {
                    this.memoryCache.delete(key);
                }
            }
        }
        if (this.config.enableLocalStorage && typeof localStorage !== 'undefined') {
            try {
                const keys = Object.keys(localStorage);
                keys.forEach(key => {
                    if (key.startsWith('ab_test_')) {
                        const storedItem = localStorage.getItem(key);
                        if (storedItem) {
                            const parsedItem = JSON.parse(storedItem);
                            if (now - parsedItem.timestamp >= this.config.localStorageExpire) {
                                localStorage.removeItem(key);
                            }
                        }
                    }
                });
            }
            catch (error) {
                console.warn('Failed to cleanup expired items from localStorage:', error);
            }
        }
    }
}
exports.CacheManager = CacheManager;
//# sourceMappingURL=CacheManager.js.map
# A/B测试SDK使用文档

## 概述

A/B测试SDK是一个轻量级的端侧A/B测试解决方案，提供稳定的流量分流、缓存管理和页面快照功能，确保实验数据的准确性和用户体验的稳定性。

## 快速开始

### 安装

```bash
# 使用npm安装
npm install ./sdk

# 或使用yarn安装
yarn add ./sdk
```

### 基本使用

```typescript
import { ABTestSDK } from 'ab-test-sdk';

// 初始化SDK
const sdk = new ABTestSDK({
  cache: {
    memoryCacheExpire: 5 * 60 * 1000,    // 内存缓存过期时间（5分钟）
    localStorageExpire: 24 * 60 * 60 * 1000, // 本地存储过期时间（24小时）
    enableMemoryCache: true,
    enableLocalStorage: true
  }
});

// 初始化SDK（异步）
async function initSDK() {
  try {
    await sdk.initialize({
      deviceId: 'your-device-id',
      isLoggedIn: false
    });
    console.log('SDK初始化完成');
  } catch (error) {
    console.error('SDK初始化失败:', error);
  }
}

// 进入页面
function enterPage() {
  const results = sdk.enterPage('/home');
  console.log('实验结果:', results);
}

// 获取实验变量
function getExperimentVariable() {
  const buttonColor = sdk.getVariable('exp_001', 'buttonColor', 'blue');
  console.log('按钮颜色:', buttonColor);
}

// 运行初始化
initSDK().then(enterPage).then(getExperimentVariable);
```

## 核心功能

### 1. 自动从后端获取实验数据

SDK在初始化时会自动从后端API获取实验数据，实现了智能的缓存策略：

- **有缓存时**：直接使用缓存数据，并异步调用API更新缓存
- **无缓存时**：同步调用API获取数据，确保初始化完成后即可使用
- **路由匹配**：根据提供的页面路由获取匹配的实验数据，避免无关实验的冗余下发
- **互斥管控**：服务端会自动应用互斥组管控和优先级排序，确保同一页面/组件唯一生效实验

### 2. 页面级快照防UI抖动

- 页面进入时生成实验快照，在页面生命周期内保持不变
- 后台异步更新的新配置仅更新缓存，不影响当前页面
- 确保页面渲染稳定，无闪烁或跳动

### 3. 跨登录态分组一致性

- 未登录用户使用deviceId进行分流
- 登录后自动将分组绑定到userId，确保登录前后分组一致
- 本地持久化缓存，跨会话保持分组稳定

### 4. 实验冲突解决

- 基于实验层级、互斥组和优先级的冲突解决机制
- 确保同一页面/组件唯一生效实验

## API参考

### 初始化

```typescript
/**
 * 初始化SDK
 * @param userContext 用户上下文
 * @param route 页面路由（可选）
 * @returns Promise
 */
async initialize(userContext: UserContext, route?: string): Promise<void>
```

**参数说明**：
- `userContext`：用户上下文对象
  - `deviceId`：设备ID（必填）
  - `userId`：用户ID（登录后提供）
  - `isLoggedIn`：是否已登录
- `route`：页面路由（可选，用于获取与当前页面匹配的实验数据）

**功能**：
- 初始化SDK并自动从后端获取实验数据
- 根据提供的路由参数获取匹配的实验数据
- 处理登录态绑定和分组继承

### 页面进入

```typescript
/**
 * 页面进入
 * @param route 页面路由
 * @param experiments 实验配置列表（可选，默认使用从后端获取的数据）
 * @returns 实验结果列表
 */
enterPage(route: string, experiments?: Experiment[]): ExperimentResult[]
```

**参数说明**：
- `route`：页面路由（必填）
- `experiments`：实验配置列表（可选，优先级高于从后端获取的数据）

**返回值**：
- 实验结果列表，包含每个实验的分组信息和变量配置

### 获取实验变量

```typescript
/**
 * 获取实验变量
 * @param experimentId 实验ID
 * @param variableName 变量名
 * @param defaultValue 默认值
 * @returns 变量值
 */
getVariable<T = any>(experimentId: string, variableName: string, defaultValue?: T): T
```

**参数说明**：
- `experimentId`：实验ID（必填）
- `variableName`：变量名（必填）
- `defaultValue`：默认值（可选，当实验未命中或变量不存在时使用）

**返回值**：
- 变量值，类型为指定的泛型T

### 刷新实验数据

```typescript
/**
 * 刷新实验数据
 * @param route 页面路由（可选，用于获取与当前页面匹配的实验数据）
 * @returns Promise
 */
async refreshExperiments(route?: string): Promise<void>
```

**功能**：
- 强制同步获取最新的实验数据，不使用缓存
- 根据提供的路由参数获取匹配的实验数据
- 适用于需要立即获取最新配置的场景

### 其他方法

- `updateUserContext(context: Partial<UserContext>): void` - 更新用户上下文
- `exitPage(route: string): void` - 页面退出
- `isControlGroup(experimentId: string): boolean` - 判断是否为对照组
- `getExperimentResult(experimentId: string): ExperimentResult | null` - 获取实验结果
- `getCurrentSnapshot(): PageSnapshot | null` - 获取当前快照
- `getExperimentContext(): Record<string, string>` - 获取实验上下文（用于数据上报）
- `getAllActiveExperiments(): string[]` - 获取所有活跃实验
- `getExperiments(): Experiment[]` - 获取当前实验数据
- `cleanupExpiredCache(): void` - 清理过期缓存
- `clearCache(): void` - 清除所有缓存

## 缓存策略

SDK实现了三级缓存策略：

1. **内存缓存**：页面生命周期内使用，速度最快
2. **本地存储缓存**：跨会话、跨重启保存，弱网/无网场景下可用
3. **远端配置**：后台异步拉取，确保配置最终一致性

## 错误处理

- SDK内部会捕获并处理网络请求和缓存操作的异常
- 当API请求失败时，会自动使用缓存数据作为兜底
- 所有公开方法都支持try-catch捕获异常

## 最佳实践

1. **初始化时机**：在应用启动时初始化SDK，确保后续操作有实验数据可用
2. **页面管理**：在页面进入时调用`enterPage`，退出时调用`exitPage`
3. **变量获取**：在组件渲染时使用`getVariable`获取实验变量，提供默认值确保兜底
4. **数据上报**：使用`getExperimentContext`获取实验上下文，注入到埋点事件中
5. **定期刷新**：在合适的时机调用`refreshExperiments`获取最新配置

## 示例场景

### 场景1：基本使用（带路由参数）

```typescript
// 初始化SDK并指定初始路由
await sdk.initialize(
  {
    deviceId: 'device-123',
    isLoggedIn: false
  },
  '/home' // 初始路由，用于获取匹配的实验数据
);

// 进入首页（路由会自动更新）
const homeResults = sdk.enterPage('/home');

// 获取实验变量
const buttonColor = sdk.getVariable('exp_001', 'buttonColor', 'blue');
const buttonText = sdk.getVariable('exp_001', 'buttonText', '提交');

// 渲染页面
renderPage({
  buttonColor,
  buttonText
});

// 页面退出
sdk.exitPage('/home');
```

### 场景2：用户登录

```typescript
// 初始化SDK（未登录）
await sdk.initialize({
  deviceId: 'device-123',
  isLoggedIn: false
});

// 用户登录
sdk.updateUserContext({
  userId: 'user-456',
  isLoggedIn: true
});

// 登录后分组会自动继承，无需重新分流
const isControl = sdk.isControlGroup('exp_001');
```

### 场景3：手动传入实验数据

```typescript
// 初始化SDK
await sdk.initialize({
  deviceId: 'device-123',
  isLoggedIn: false
});

// 手动传入实验数据（优先级高于从后端获取的数据）
const customExperiments = [
  // 自定义实验配置
];

const results = sdk.enterPage('/home', customExperiments);
```

### 场景4：多页面切换

```typescript
// 初始化SDK
await sdk.initialize({
  deviceId: 'device-123',
  isLoggedIn: false
});

// 进入首页，自动获取与/home路由匹配的实验数据
const homeResults = sdk.enterPage('/home');
console.log('首页实验:', homeResults);

// 进入商品页，自动获取与/product路由匹配的实验数据
const productResults = sdk.enterPage('/product/123');
console.log('商品页实验:', productResults);

// 刷新商品页的实验数据
await sdk.refreshExperiments('/product/123');
console.log('刷新后的商品页实验:', sdk.getExperiments());

// 退出页面
sdk.exitPage('/product/123');
sdk.exitPage('/home');
```

## 故障排查

### 常见问题

1. **实验数据未加载**：检查网络连接和后端API是否正常
2. **分组不稳定**：确保deviceId在不同会话中保持一致
3. **UI抖动**：确保在页面进入时调用`enterPage`，并在整个页面生命周期内使用同一快照
4. **缓存问题**：可调用`clearCache()`清除所有缓存，或`cleanupExpiredCache()`清理过期缓存

### 日志

SDK会在控制台输出关键操作的日志，包括：
- 初始化状态
- 实验数据加载情况
- 缓存操作
- 错误信息

## 版本历史

- v1.0.0：初始版本，支持基本的A/B测试功能
- v1.1.0：添加自动从后端获取实验数据的功能
- v1.2.0：优化缓存策略，实现有缓存时异步更新的逻辑
- v1.3.0：添加根据路由获取实验数据的功能，支持服务端路由匹配和互斥管控

## 联系我们

如有任何问题或建议，请联系我们的技术支持团队。

import { ABTestSDK, Experiment } from './src/index';

const sdk = new ABTestSDK({
  cache: {
    memoryCacheExpire: 5 * 60 * 1000,
    localStorageExpire: 24 * 60 * 60 * 1000,
    enableMemoryCache: true,
    enableLocalStorage: true
  },
  enableSnapshot: true,
  enableAutoLoginBinding: true
});

// 模拟实验数据（仅用于示例，实际使用时会从后端获取）
const mockExperiments: Experiment[] = [
  {
    id: 'exp_001',
    name: '首页按钮颜色测试',
    description: '测试不同按钮颜色对点击率的影响',
    status: 'running',
    layer: 'ui',
    trafficRatio: 100,
    priority: 1,
    groups: [
      {
        id: 'group_001',
        experimentId: 'exp_001',
        name: '对照组',
        ratio: 50,
        variables: { buttonColor: 'blue', buttonText: '提交' },
        isControl: true
      },
      {
        id: 'group_002',
        experimentId: 'exp_001',
        name: '实验组A',
        ratio: 30,
        variables: { buttonColor: 'red', buttonText: '立即提交' },
        isControl: false
      },
      {
        id: 'group_003',
        experimentId: 'exp_001',
        name: '实验组B',
        ratio: 20,
        variables: { buttonColor: 'green', buttonText: '马上提交' },
        isControl: false
      }
    ],
    routeRules: [
      { id: 'rule_001', experimentId: 'exp_001', type: 'exact', pattern: '/home' }
    ],
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'exp_002',
    name: '推荐算法优化',
    description: '测试新的推荐算法对用户停留时间的影响',
    status: 'running',
    layer: 'algorithm',
    trafficRatio: 100,
    priority: 2,
    groups: [
      {
        id: 'group_004',
        experimentId: 'exp_002',
        name: '对照组',
        ratio: 50,
        variables: { algorithmVersion: 'v1.0', maxRecommendations: 5 },
        isControl: true
      },
      {
        id: 'group_005',
        experimentId: 'exp_002',
        name: '实验组',
        ratio: 50,
        variables: { algorithmVersion: 'v2.0', maxRecommendations: 10 },
        isControl: false
      }
    ],
    routeRules: [
      { id: 'rule_002', experimentId: 'exp_002', type: 'wildcard', pattern: '/product/*' }
    ],
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
];

// 示例1：基本使用（自动从后端获取实验数据）
async function basicUsage() {
  console.log('=== A/B测试SDK示例1：基本使用 ===\n');

  console.log('1. 初始化SDK（未登录用户）');
  try {
    // 初始化时会自动从后端获取实验数据
    // 有缓存时使用缓存并异步更新，无缓存时同步获取
    await sdk.initialize(
      {
        deviceId: 'device_example_12345',
      },
      '/home' // 传入初始路由，获取与首页匹配的实验数据
    );
    console.log('✓ SDK初始化完成');
    
    // 获取当前实验数据
    const experiments = sdk.getExperiments();
    console.log('✓ 实验数据加载完成，数量:', experiments.length);
  } catch (error) {
    console.error('初始化失败:', error);
  }
  console.log();

  console.log('2. 进入首页页面（使用从后端获取的实验数据）');
  try {
    // 现在可以不传入实验数据，默认使用从后端获取的数据
    const homeResults = sdk.enterPage('/home');
    console.log('✓ 首页实验结果:', homeResults);
    console.log('  - 活跃实验数量:', homeResults.length);
    homeResults.forEach(result => {
      console.log(`  - 实验 ${result.experimentId}: ${result.groupName} (${result.groupId})`);
      console.log(`    - 变量:`, result.variables);
    });
  } catch (error) {
    console.error('进入页面失败:', error);
  }
  console.log();

  console.log('3. 获取实验变量');
  try {
    const buttonColor = sdk.getVariable('exp_001', 'buttonColor', 'blue');
    const buttonText = sdk.getVariable('exp_001', 'buttonText', '提交');
    console.log('✓ 按钮颜色:', buttonColor);
    console.log('✓ 按钮文字:', buttonText);
  } catch (error) {
    console.error('获取变量失败:', error);
  }
  console.log();

  console.log('4. 判断是否为对照组');
  try {
    const isControl = sdk.isControlGroup('exp_001');
    console.log('✓ 是否为对照组:', isControl);
  } catch (error) {
    console.error('判断对照组失败:', error);
  }
  console.log();

  console.log('5. 获取实验上下文（用于数据上报）');
  try {
    const context = sdk.getExperimentContext();
    console.log('✓ 实验上下文:', context);
  } catch (error) {
    console.error('获取上下文失败:', error);
  }
  console.log();

  console.log('6. 用户登录');
  try {
    sdk.updateUserContext({
      userId: 'user_example_67890',
    });
    console.log('✓ 用户登录成功，分组已继承');
    console.log('✓ 当前标识符:', sdk.getCurrentIdentifier());
  } catch (error) {
    console.error('登录失败:', error);
  }
  console.log();

  console.log('7. 获取当前快照');
  try {
    const snapshot = sdk.getCurrentSnapshot();
    console.log('✓ 当前快照:', snapshot?.route);
    console.log('  - 快照时间:', new Date(snapshot!.timestamp).toLocaleString());
    console.log('  - 实验数量:', snapshot?.results.length);
  } catch (error) {
    console.error('获取快照失败:', error);
  }
  console.log();

  console.log('8. 进入商品详情页');
  try {
    const productResults = sdk.enterPage('/product/123');
    console.log('✓ 商品页实验结果:', productResults);
    console.log('  - 活跃实验数量:', productResults.length);
    productResults.forEach(result => {
      console.log(`  - 实验 ${result.experimentId}: ${result.groupName}`);
      if (result.variables.algorithmVersion) {
        console.log(`    - 算法版本:`, result.variables.algorithmVersion);
        console.log(`    - 最大推荐数:`, result.variables.maxRecommendations);
      }
    });
  } catch (error) {
    console.error('进入商品页失败:', error);
  }
  console.log();

  console.log('9. 退出商品详情页');
  try {
    sdk.exitPage('/product/123');
    console.log('✓ 已退出商品详情页');
  } catch (error) {
    console.error('退出页面失败:', error);
  }
  console.log();

  console.log('10. 清理过期缓存');
  try {
    sdk.cleanupExpiredCache();
    console.log('✓ 过期缓存已清理');
  } catch (error) {
    console.error('清理缓存失败:', error);
  }
  console.log();

  console.log('=== 示例1完成 ===\n');
}

// 示例2：手动传入实验数据（向后兼容）
async function manualDataUsage() {
  console.log('=== A/B测试SDK示例2：手动传入实验数据 ===\n');

  console.log('1. 初始化SDK');
  try {
    await sdk.initialize({
      deviceId: 'device_example_12345',
    });
    console.log('✓ SDK初始化完成');
  } catch (error) {
    console.error('初始化失败:', error);
  }
  console.log();

  console.log('2. 进入页面并手动传入实验数据');
  try {
    // 仍然支持手动传入实验数据，优先级高于从后端获取的数据
    const results = sdk.enterPage('/home', mockExperiments);
    console.log('✓ 页面实验结果:', results);
    console.log('  - 活跃实验数量:', results.length);
  } catch (error) {
    console.error('进入页面失败:', error);
  }
  console.log();

  console.log('=== 示例2完成 ===\n');
}

// 示例3：刷新实验数据
async function refreshDataUsage() {
  console.log('=== A/B测试SDK示例3：刷新实验数据 ===\n');

  console.log('1. 初始化SDK');
  try {
    await sdk.initialize({
      deviceId: 'device_example_12345',
    });
    console.log('✓ SDK初始化完成');
  } catch (error) {
    console.error('初始化失败:', error);
  }
  console.log();

  console.log('2. 刷新实验数据');
  try {
    console.log('  - 开始刷新...');
    await sdk.refreshExperiments();
    console.log('✓ 实验数据刷新完成');
    const experiments = sdk.getExperiments();
    console.log('  - 最新实验数量:', experiments.length);
  } catch (error) {
    console.error('刷新数据失败:', error);
  }
  console.log();

  console.log('=== 示例3完成 ===\n');
}

// 示例4：多页面切换
async function multiPageUsage() {
  console.log('=== A/B测试SDK示例4：多页面切换 ===\n');

  console.log('1. 初始化SDK');
  try {
    await sdk.initialize({
      deviceId: 'device_example_12345',
    });
    console.log('✓ SDK初始化完成');
  } catch (error) {
    console.error('初始化失败:', error);
  }
  console.log();

  console.log('2. 进入首页');
  try {
    // 进入首页，自动获取与/home路由匹配的实验数据
    const homeResults = sdk.enterPage('/home');
    console.log('✓ 首页实验结果:', homeResults);
    console.log('  - 活跃实验数量:', homeResults.length);
  } catch (error) {
    console.error('进入首页失败:', error);
  }
  console.log();

  console.log('3. 进入商品详情页');
  try {
    // 进入商品详情页，自动获取与/product路由匹配的实验数据
    const productResults = sdk.enterPage('/product/123');
    console.log('✓ 商品页实验结果:', productResults);
    console.log('  - 活跃实验数量:', productResults.length);
  } catch (error) {
    console.error('进入商品页失败:', error);
  }
  console.log();

  console.log('4. 刷新商品页实验数据');
  try {
    await sdk.refreshExperiments('/product/123');
    console.log('✓ 商品页实验数据刷新完成');
    const experiments = sdk.getExperiments();
    console.log('  - 当前实验数量:', experiments.length);
  } catch (error) {
    console.error('刷新实验数据失败:', error);
  }
  console.log();

  console.log('5. 退出页面');
  try {
    sdk.exitPage('/product/123');
    sdk.exitPage('/home');
    console.log('✓ 已退出所有页面');
  } catch (error) {
    console.error('退出页面失败:', error);
  }
  console.log();

  console.log('=== 示例4完成 ===\n');
}

// 运行所有示例
async function runExamples() {
  await basicUsage();
  await manualDataUsage();
  await refreshDataUsage();
  await multiPageUsage();
  console.log('=== 所有示例运行完成 ===');
}

// 执行示例
runExamples().catch(error => {
  console.error('运行示例失败:', error);
});
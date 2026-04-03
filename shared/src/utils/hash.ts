// 路由匹配验证
export function validateRouteMatch(
  currentRoute: string,
  routeRules: any[]
): boolean {
  return routeRules.some(rule => {
    switch (rule.type) {
      case 'exact':
        return currentRoute === rule.pattern;
      case 'wildcard':
        return currentRoute.startsWith(rule.pattern.replace('*', ''));
      case 'hierarchy':
        return currentRoute.startsWith(rule.pattern);
      default:
        return false;
    }
  });
}

// 简单的哈希函数，用于用户分组
export function simpleHash(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 转换为32位整数
  }
  return Math.abs(hash);
}

// 根据用户ID和实验ID计算哈希值，用于分配实验组
export function getExperimentHash(userId: string | undefined, deviceId: string, experimentId: string): number {
  const input = `${userId || deviceId}_${experimentId}`;
  return simpleHash(input);
}

// 根据哈希值和流量比例分配实验组
export function assignGroupByHash(hash: number, groups: any[]): string {
  const totalRatio = groups.reduce((sum, group) => sum + group.ratio, 0);
  const normalizedHash = (hash % 100) / 100;
  
  let cumulativeRatio = 0;
  for (const group of groups) {
    cumulativeRatio += group.ratio / totalRatio;
    if (normalizedHash <= cumulativeRatio) {
      return group.id;
    }
  }
  
  return groups[0].id; // 默认返回第一个组
}
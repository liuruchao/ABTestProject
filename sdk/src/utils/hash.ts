/**
 * 哈希工具类
 * 提供稳定哈希分流和分组分配功能
 */
import CryptoJS from 'crypto-js';

// 哈希盐值
const SALT = 'ab_test_salt_2024';

/**
 * 生成哈希值
 * @param identifier 用户标识符
 * @param experimentId 实验ID
 * @returns 0-99的哈希值
 */
export function generateHash(identifier: string, experimentId: string): number {
  console.log('=== 哈希函数调用 ===');
  console.log('输入参数 - 标识符:', identifier);
  console.log('输入参数 - 实验ID:', experimentId);
  console.log('输入参数 - 盐值:', SALT);
  
  const combined = `${identifier}_${experimentId}_${SALT}`;
  console.log('组合字符串:', combined);
  
  const hash = CryptoJS.SHA256(combined).toString();
  console.log('SHA256哈希:', hash);
  
  const hashNum = parseInt(hash.substring(0, 8), 16);
  console.log('前8位16进制:', hash.substring(0, 8));
  console.log('转换为数字:', hashNum);
  
  const result = hashNum % 100;
  console.log('最终哈希值:', result);
  console.log('=== 哈希函数调用结束 ===\n');
  return result;
}

/**
 * 根据哈希值分配实验组
 * @param hashValue 哈希值
 * @param groups 实验组列表
 * @returns 分配的实验组ID
 */
export function assignGroup(hashValue: number, groups: any[]): string {
  console.log('分组分配调试:');
  console.log('  输入哈希值:', hashValue);
  console.log('  实验组数量:', groups.length);
  
  let accumulatedRatio = 0;
  
  for (const group of groups) {
    const previousRatio = accumulatedRatio;
    accumulatedRatio += group.ratio;
    console.log(`  检查组 ${group.name}: 比例${group.ratio}%, 累计范围[${previousRatio}, ${accumulatedRatio})`);
    
    if (hashValue < accumulatedRatio) {
      console.log(`  哈希值${hashValue}落在[${previousRatio}, ${accumulatedRatio})范围内，分配到组: ${group.name}`);
      return group.id;
    }
  }
  
  console.log(`  哈希值${hashValue}未落在任何组范围内，分配到最后一个组: ${groups[groups.length - 1].name}`);
  return groups[groups.length - 1].id;
}

/**
 * 根据ID获取实验组
 * @param groupId 实验组ID
 * @param groups 实验组列表
 * @returns 实验组
 */
export function getGroupById(groupId: string, groups: any[]): any {
  return groups.find(g => g.id === groupId);
}

/**
 * 根据名称获取实验组
 * @param groupName 实验组名称
 * @param groups 实验组列表
 * @returns 实验组
 */
export function getGroupByName(groupName: string, groups: any[]): any {
  return groups.find(g => g.name === groupName);
}
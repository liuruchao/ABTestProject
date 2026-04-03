/**
 * 生成哈希值
 * @param identifier 用户标识符
 * @param experimentId 实验ID
 * @returns 0-99的哈希值
 */
export declare function generateHash(identifier: string, experimentId: string): number;
/**
 * 根据哈希值分配实验组
 * @param hashValue 哈希值
 * @param groups 实验组列表
 * @returns 分配的实验组ID
 */
export declare function assignGroup(hashValue: number, groups: any[]): string;
/**
 * 根据ID获取实验组
 * @param groupId 实验组ID
 * @param groups 实验组列表
 * @returns 实验组
 */
export declare function getGroupById(groupId: string, groups: any[]): any;
/**
 * 根据名称获取实验组
 * @param groupName 实验组名称
 * @param groups 实验组列表
 * @returns 实验组
 */
export declare function getGroupByName(groupName: string, groups: any[]): any;
//# sourceMappingURL=hash.d.ts.map
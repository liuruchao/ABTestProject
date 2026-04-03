import { Experiment as ExperimentType } from '@shared/types';
import { Experiment, ExperimentGroup, RouteRule } from '../models';

export class ExperimentService {
  async listExperiments(): Promise<ExperimentType[]> {
    const experiments = await Experiment.findAll({
      include: [
        {
          model: ExperimentGroup,
          as: 'groups'
        },
        {
          model: RouteRule,
          as: 'routeRules'
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return experiments.map(exp => this.mapToExperimentType(exp));
  }

  async createExperiment(data: any): Promise<ExperimentType> {
    const { groups = [], routeRules = [], ...experimentData } = data;

    const experiment = await Experiment.create(experimentData);

    // 创建实验组
    if (groups.length > 0) {
      await Promise.all(
        groups.map((group: any) => 
          ExperimentGroup.create({
            ...group,
            experimentId: experiment.id,
            variables: JSON.stringify(group.variables || {})
          })
        )
      );
    }

    // 创建路由规则
    if (routeRules.length > 0) {
      await Promise.all(
        routeRules.map((rule: any) => 
          RouteRule.create({
            ...rule,
            experimentId: experiment.id
          })
        )
      );
    }

    // 重新查询完整数据
    const createdExperiment = await Experiment.findByPk(experiment.id, {
      include: [
        {
          model: ExperimentGroup,
          as: 'groups'
        },
        {
          model: RouteRule,
          as: 'routeRules'
        }
      ]
    });

    return this.mapToExperimentType(createdExperiment!);
  }

  async updateExperiment(id: string, data: any): Promise<ExperimentType> {
    const { groups = [], routeRules = [], ...experimentData } = data;

    const experiment = await Experiment.findByPk(id);
    if (!experiment) {
      throw new Error('Experiment not found');
    }

    // 更新实验基本信息
    await experiment.update({
      ...experimentData,
      updatedAt: Date.now()
    });

    // 更新实验组
    await ExperimentGroup.destroy({ where: { experimentId: id } });
    if (groups.length > 0) {
      await Promise.all(
        groups.map((group: any) => 
          ExperimentGroup.create({
            ...group,
            experimentId: id,
            variables: JSON.stringify(group.variables || {})
          })
        )
      );
    }

    // 更新路由规则
    await RouteRule.destroy({ where: { experimentId: id } });
    if (routeRules.length > 0) {
      await Promise.all(
        routeRules.map((rule: any) => 
          RouteRule.create({
            ...rule,
            experimentId: id
          })
        )
      );
    }

    // 重新查询完整数据
    const updatedExperiment = await Experiment.findByPk(id, {
      include: [
        {
          model: ExperimentGroup,
          as: 'groups'
        },
        {
          model: RouteRule,
          as: 'routeRules'
        }
      ]
    });

    return this.mapToExperimentType(updatedExperiment!);
  }

  async deleteExperiment(id: string): Promise<void> {
    const experiment = await Experiment.findByPk(id);
    if (!experiment) {
      throw new Error('Experiment not found');
    }

    // 删除关联数据
    await ExperimentGroup.destroy({ where: { experimentId: id } });
    await RouteRule.destroy({ where: { experimentId: id } });
    
    // 删除实验
    await experiment.destroy();
  }

  async getExperiment(id: string): Promise<ExperimentType> {
    const experiment = await Experiment.findByPk(id, {
      include: [
        {
          model: ExperimentGroup,
          as: 'groups'
        },
        {
          model: RouteRule,
          as: 'routeRules'
        }
      ]
    });

    if (!experiment) {
      throw new Error('Experiment not found');
    }

    return this.mapToExperimentType(experiment);
  }

  private mapToExperimentType(experiment: any): ExperimentType {
    return {
      id: experiment.id,
      name: experiment.name,
      description: experiment.description,
      status: experiment.status,
      layer: experiment.layer,
      routeRules: experiment.routeRules.map((rule: any) => ({
        type: rule.type,
        pattern: rule.pattern
      })),
      trafficRatio: experiment.trafficRatio,
      groups: experiment.groups.map((group: any) => ({
        id: group.id,
        name: group.name,
        ratio: group.ratio,
        variables: JSON.parse(group.variables || '{}')
      })),
      mutexGroupId: experiment.mutexGroupId,
      priority: experiment.priority,
      createdAt: experiment.createdAt,
      updatedAt: experiment.updatedAt
    };
  }

  /**
   * 根据路由获取实验数据，应用互斥管控和优先级排序
   * @param route 页面路由
   * @returns 处理后的实验数据列表
   */
  async getExperimentsByRoute(route: string): Promise<ExperimentType[]> {
    // 获取所有实验
    const experiments = await Experiment.findAll({
      include: [
        {
          model: ExperimentGroup,
          as: 'groups'
        },
        {
          model: RouteRule,
          as: 'routeRules'
        }
      ]
    });

    const mappedExperiments = experiments.map(exp => this.mapToExperimentType(exp));

    // 1. 过滤出运行中的实验
    const runningExperiments = mappedExperiments.filter(exp => exp.status === 'running');

    // 2. 根据路由规则过滤实验
    const routeMatchedExperiments = runningExperiments.filter(experiment => {
      // 如果实验没有路由规则，则默认匹配
      if (!experiment.routeRules || experiment.routeRules.length === 0) {
        return true;
      }

      // 检查是否有任何路由规则匹配当前路由
      return experiment.routeRules.some(rule => this.matchRoute(route, rule.pattern, rule.type));
    });

    // 3. 应用互斥组管控和优先级排序
    const finalExperiments = this.applyMutexAndPriority(routeMatchedExperiments);

    return finalExperiments;
  }

  /**
   * 匹配路由
   * @param currentRoute 当前路由
   * @param pattern 规则模式
   * @param type 匹配类型
   * @returns 是否匹配
   */
  private matchRoute(currentRoute: string, pattern: string, type: string): boolean {
    switch (type) {
      case 'exact':
        return currentRoute === pattern;
      case 'wildcard':
        // 简单的通配符匹配，如 /product/*
        const wildcardPattern = pattern.replace('*', '.*');
        const wildcardRegex = new RegExp(`^${wildcardPattern}$`);
        return wildcardRegex.test(currentRoute);
      case 'hierarchy':
        // 层级匹配，如 /user 匹配 /user, /user/profile, /user/settings 等
        return currentRoute === pattern || currentRoute.startsWith(`${pattern}/`);
      default:
        return false;
    }
  }

  /**
   * 应用互斥组管控和优先级排序
   * @param experiments 实验列表
   * @returns 处理后的实验列表
   */
  private applyMutexAndPriority(experiments: ExperimentType[]): ExperimentType[] {
    // 按层级分组
    const experimentsByLayer = new Map<string, ExperimentType[]>();
    experiments.forEach(exp => {
      const layer = exp.layer || 'default';
      if (!experimentsByLayer.has(layer)) {
        experimentsByLayer.set(layer, []);
      }
      experimentsByLayer.get(layer)!.push(exp);
    });

    const result: ExperimentType[] = [];

    // 处理每个层级的实验
    experimentsByLayer.forEach(layerExperiments => {
      // 按互斥组分组
      const experimentsByMutexGroup = new Map<string, ExperimentType[]>();
      const noMutexExperiments: ExperimentType[] = [];
      
      layerExperiments.forEach(exp => {
        // 只有明确设置了mutexGroupId的实验才参与互斥组管控
        if (exp.mutexGroupId) {
          if (!experimentsByMutexGroup.has(exp.mutexGroupId)) {
            experimentsByMutexGroup.set(exp.mutexGroupId, []);
          }
          experimentsByMutexGroup.get(exp.mutexGroupId)!.push(exp);
        } else {
          // 没有设置互斥组的实验，直接添加到结果中
          noMutexExperiments.push(exp);
        }
      });

      // 处理每个互斥组的实验
      experimentsByMutexGroup.forEach(mutexExperiments => {
        // 按优先级排序（优先级值越大，优先级越高）
        mutexExperiments.sort((a, b) => {
          // 首先按优先级排序
          if (b.priority !== a.priority) {
            return b.priority - a.priority;
          }
          // 优先级相同，按创建时间排序（最新的优先）
          return b.createdAt - a.createdAt;
        });

        // 同一互斥组只保留优先级最高的实验
        if (mutexExperiments.length > 0) {
          result.push(mutexExperiments[0]);
        }
      });

      // 添加没有互斥组的实验
      result.push(...noMutexExperiments);
    });

    return result;
  }
}
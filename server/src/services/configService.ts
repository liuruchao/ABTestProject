import { GlobalConfig, PageConfig, Experiment } from '@shared/types';
import { Experiment as ExperimentModel, ExperimentGroup, RouteRule } from '../models';
import { validateRouteMatch } from '@shared/utils/hash';

export class ConfigService {
  async getGlobalConfig(): Promise<GlobalConfig> {
    const experiments = await ExperimentModel.findAll({
      include: [
        {
          model: RouteRule,
          as: 'routeRules'
        }
      ],
      where: {
        status: 'running'
      }
    });

    const experimentMetadata = experiments.map(exp => ({
      id: exp.id,
      name: exp.name,
      layer: exp.layer,
      routeRules: exp.routeRules.map((rule: any) => ({
        type: rule.type,
        pattern: rule.pattern
      })),
      mutexGroupId: exp.mutexGroupId,
      priority: exp.priority,
      status: exp.status
    }));

    return {
      version: '1.0.0',
      experiments: experimentMetadata,
      lastUpdated: Date.now()
    };
  }

  async getPageConfig(route: string): Promise<PageConfig> {
    // 获取所有运行中的实验
    const allExperiments = await ExperimentModel.findAll({
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
      where: {
        status: 'running'
      }
    });

    // 过滤出与当前路由匹配的实验
    const matchedExperiments = allExperiments.filter(exp => 
      validateRouteMatch(route, exp.routeRules)
    );

    // 处理实验冲突和优先级
    const resolvedExperiments = this.resolveExperimentConflicts(matchedExperiments);

    // 转换为前端需要的格式
    const experiments: Experiment[] = resolvedExperiments.map(exp => ({
      id: exp.id,
      name: exp.name,
      description: exp.description,
      status: exp.status,
      layer: exp.layer,
      routeRules: exp.routeRules.map((rule: any) => ({
        type: rule.type,
        pattern: rule.pattern
      })),
      trafficRatio: exp.trafficRatio,
      groups: exp.groups.map((group: any) => ({
        id: group.id,
        name: group.name,
        ratio: group.ratio,
        variables: JSON.parse(group.variables || '{}')
      })),
      mutexGroupId: exp.mutexGroupId,
      priority: exp.priority,
      createdAt: exp.createdAt,
      updatedAt: exp.updatedAt
    }));

    return {
      route,
      experiments,
      lastUpdated: Date.now()
    };
  }

  async syncConfig(config: any): Promise<any> {
    // 这里可以实现配置同步逻辑
    // 例如从远程配置中心拉取最新配置
    return { success: true, message: 'Config synced successfully' };
  }

  private resolveExperimentConflicts(experiments: any[]): any[] {
    // 按层级分组
    const experimentsByLayer: Record<string, any[]> = {};
    
    experiments.forEach(exp => {
      if (!experimentsByLayer[exp.layer]) {
        experimentsByLayer[exp.layer] = [];
      }
      experimentsByLayer[exp.layer].push(exp);
    });

    const resolvedExperiments: any[] = [];

    // 处理每个层级的实验
    Object.values(experimentsByLayer).forEach(layerExperiments => {
      // 按互斥组分组
      const experimentsByMutex: Record<string, any[]> = {};
      
      layerExperiments.forEach(exp => {
        const mutexGroupId = exp.mutexGroupId || 'default';
        if (!experimentsByMutex[mutexGroupId]) {
          experimentsByMutex[mutexGroupId] = [];
        }
        experimentsByMutex[mutexGroupId].push(exp);
      });

      // 每个互斥组只保留优先级最高的实验
      Object.values(experimentsByMutex).forEach(mutexExperiments => {
        // 按优先级排序，优先级高的在前
        mutexExperiments.sort((a, b) => b.priority - a.priority);
        // 保留优先级最高的实验
        if (mutexExperiments.length > 0) {
          resolvedExperiments.push(mutexExperiments[0]);
        }
      });
    });

    return resolvedExperiments;
  }
}

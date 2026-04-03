import axios from 'axios';
import { Experiment } from '@shared/types';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 实验相关接口
export const experimentApi = {
  // 获取实验列表
  listExperiments: async (): Promise<Experiment[]> => {
    const response = await api.get('/experiment');
    return response.data;
  },

  // 创建实验
  createExperiment: async (experiment: Partial<Experiment>): Promise<Experiment> => {
    const response = await api.post('/experiment', experiment);
    return response.data;
  },

  // 更新实验
  updateExperiment: async (id: string, experiment: Partial<Experiment>): Promise<Experiment> => {
    const response = await api.put(`/experiment/${id}`, experiment);
    return response.data;
  },

  // 删除实验
  deleteExperiment: async (id: string): Promise<void> => {
    await api.delete(`/experiment/${id}`);
  },

  // 获取实验详情
  getExperiment: async (id: string): Promise<Experiment> => {
    const response = await api.get(`/experiment/${id}`);
    return response.data;
  }
};

// 配置相关接口
export const configApi = {
  // 获取全局配置
  getGlobalConfig: async (): Promise<any> => {
    const response = await api.get('/config/global');
    return response.data;
  },

  // 获取页面配置
  getPageConfig: async (route: string): Promise<any> => {
    const response = await api.get(`/config/page?route=${encodeURIComponent(route)}`);
    return response.data;
  },

  // 同步配置
  syncConfig: async (config: any): Promise<any> => {
    const response = await api.post('/config/sync', config);
    return response.data;
  }
};

// 决策相关接口
export const decisionApi = {
  // 分配实验组
  assignGroup: async (userId: string | undefined, deviceId: string, experimentId: string): Promise<any> => {
    const response = await api.post('/decision/assign', {
      userId,
      deviceId,
      experimentId
    });
    return response.data;
  },

  // 验证实验组
  validateGroup: async (userId: string | undefined, deviceId: string, experimentId: string, groupId: string): Promise<any> => {
    const response = await api.post('/decision/validate', {
      userId,
      deviceId,
      experimentId,
      groupId
    });
    return response.data;
  }
};

export default {
  experiment: experimentApi,
  config: configApi,
  decision: decisionApi
};
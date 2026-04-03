export interface Experiment {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'running' | 'paused' | 'ended';
  layer: ExperimentLayer;
  routeRules: RouteRule[];
  trafficRatio: number;
  groups: ExperimentGroup[];
  mutexGroupId?: string;
  priority: number;
  createdAt: number;
  updatedAt: number;
}

export type ExperimentLayer = 'ui' | 'strategy' | 'algorithm' | 'marketing';

export interface RouteRule {
  type: 'exact' | 'wildcard' | 'hierarchy';
  pattern: string;
}

export interface ExperimentGroup {
  id: string;
  name: string;
  ratio: number;
  variables: Record<string, any>;
}

export interface GlobalConfig {
  version: string;
  experiments: ExperimentMetadata[];
  lastUpdated: number;
}

export interface ExperimentMetadata {
  id: string;
  name: string;
  layer: ExperimentLayer;
  routeRules: RouteRule[];
  mutexGroupId?: string;
  priority: number;
  status: string;
}

export interface PageConfig {
  route: string;
  experiments: Experiment[];
  lastUpdated: number;
}

export interface DecisionResult {
  experimentId: string;
  groupId: string;
  userId?: string;
  deviceId: string;
  timestamp: number;
  variables?: Record<string, any>;
}

export interface ExperimentContext {
  experiments: {
    experimentId: string;
    groupId: string;
  }[];
  userId?: string;
  deviceId: string;
}
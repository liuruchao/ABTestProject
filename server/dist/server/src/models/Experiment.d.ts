import { Model, Optional } from 'sequelize';
interface ExperimentAttributes {
    id: string;
    name: string;
    description: string;
    status: 'draft' | 'running' | 'paused' | 'ended';
    layer: 'ui' | 'strategy' | 'algorithm' | 'marketing';
    trafficRatio: number;
    mutexGroupId?: string;
    priority: number;
    createdAt: number;
    updatedAt: number;
}
interface ExperimentCreationAttributes extends Optional<ExperimentAttributes, 'id' | 'createdAt' | 'updatedAt'> {
}
declare class Experiment extends Model<ExperimentAttributes, ExperimentCreationAttributes> implements ExperimentAttributes {
    id: string;
    name: string;
    description: string;
    status: 'draft' | 'running' | 'paused' | 'ended';
    layer: 'ui' | 'strategy' | 'algorithm' | 'marketing';
    trafficRatio: number;
    mutexGroupId?: string;
    priority: number;
    createdAt: number;
    updatedAt: number;
}
export default Experiment;
//# sourceMappingURL=Experiment.d.ts.map
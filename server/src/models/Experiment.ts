import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from './index';

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

interface ExperimentCreationAttributes extends Optional<ExperimentAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Experiment extends Model<ExperimentAttributes, ExperimentCreationAttributes> implements ExperimentAttributes {
  public id!: string;
  public name!: string;
  public description!: string;
  public status!: 'draft' | 'running' | 'paused' | 'ended';
  public layer!: 'ui' | 'strategy' | 'algorithm' | 'marketing';
  public trafficRatio!: number;
  public mutexGroupId?: string;
  public priority!: number;
  public createdAt!: number;
  public updatedAt!: number;
}

Experiment.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: () => `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('draft', 'running', 'paused', 'ended'),
      defaultValue: 'draft'
    },
    layer: {
      type: DataTypes.ENUM('ui', 'strategy', 'algorithm', 'marketing'),
      allowNull: false
    },
    trafficRatio: {
      type: DataTypes.FLOAT,
      defaultValue: 100
    },
    mutexGroupId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    priority: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    createdAt: {
      type: DataTypes.BIGINT,
      defaultValue: () => Date.now()
    },
    updatedAt: {
      type: DataTypes.BIGINT,
      defaultValue: () => Date.now()
    }
  },
  {
    sequelize,
    modelName: 'Experiment',
    timestamps: false
  }
);

export default Experiment;
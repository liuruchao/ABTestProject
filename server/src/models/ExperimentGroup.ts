import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from './index';
import Experiment from './Experiment';

interface ExperimentGroupAttributes {
  id: string;
  experimentId: string;
  name: string;
  ratio: number;
  variables: string;
  createdAt: number;
  updatedAt: number;
}

interface ExperimentGroupCreationAttributes extends Optional<ExperimentGroupAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class ExperimentGroup extends Model<ExperimentGroupAttributes, ExperimentGroupCreationAttributes> implements ExperimentGroupAttributes {
  public id!: string;
  public experimentId!: string;
  public name!: string;
  public ratio!: number;
  public variables!: string;
  public createdAt!: number;
  public updatedAt!: number;
}

ExperimentGroup.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: () => `group_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    },
    experimentId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: Experiment,
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ratio: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    variables: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '{}'
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
    modelName: 'ExperimentGroup',
    timestamps: false
  }
);

// 关联关系
Experiment.hasMany(ExperimentGroup, {
  foreignKey: 'experimentId',
  as: 'groups'
});

ExperimentGroup.belongsTo(Experiment, {
  foreignKey: 'experimentId',
  as: 'experiment'
});

export default ExperimentGroup;
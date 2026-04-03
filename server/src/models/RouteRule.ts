import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from './index';
import Experiment from './Experiment';

interface RouteRuleAttributes {
  id: string;
  experimentId: string;
  type: 'exact' | 'wildcard' | 'hierarchy';
  pattern: string;
  createdAt: number;
  updatedAt: number;
}

interface RouteRuleCreationAttributes extends Optional<RouteRuleAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class RouteRule extends Model<RouteRuleAttributes, RouteRuleCreationAttributes> implements RouteRuleAttributes {
  public id!: string;
  public experimentId!: string;
  public type!: 'exact' | 'wildcard' | 'hierarchy';
  public pattern!: string;
  public createdAt!: number;
  public updatedAt!: number;
}

RouteRule.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: () => `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    },
    experimentId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: Experiment,
        key: 'id'
      }
    },
    type: {
      type: DataTypes.ENUM('exact', 'wildcard', 'hierarchy'),
      allowNull: false
    },
    pattern: {
      type: DataTypes.STRING,
      allowNull: false
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
    modelName: 'RouteRule',
    timestamps: false
  }
);

// 关联关系
Experiment.hasMany(RouteRule, {
  foreignKey: 'experimentId',
  as: 'routeRules'
});

RouteRule.belongsTo(Experiment, {
  foreignKey: 'experimentId',
  as: 'experiment'
});

export default RouteRule;
import { Model, Optional } from 'sequelize';
interface RouteRuleAttributes {
    id: string;
    experimentId: string;
    type: 'exact' | 'wildcard' | 'hierarchy';
    pattern: string;
    createdAt: number;
    updatedAt: number;
}
interface RouteRuleCreationAttributes extends Optional<RouteRuleAttributes, 'id' | 'createdAt' | 'updatedAt'> {
}
declare class RouteRule extends Model<RouteRuleAttributes, RouteRuleCreationAttributes> implements RouteRuleAttributes {
    id: string;
    experimentId: string;
    type: 'exact' | 'wildcard' | 'hierarchy';
    pattern: string;
    createdAt: number;
    updatedAt: number;
}
export default RouteRule;
//# sourceMappingURL=RouteRule.d.ts.map
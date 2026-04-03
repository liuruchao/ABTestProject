import { Model, Optional } from 'sequelize';
interface ExperimentGroupAttributes {
    id: string;
    experimentId: string;
    name: string;
    ratio: number;
    variables: string;
    createdAt: number;
    updatedAt: number;
}
interface ExperimentGroupCreationAttributes extends Optional<ExperimentGroupAttributes, 'id' | 'createdAt' | 'updatedAt'> {
}
declare class ExperimentGroup extends Model<ExperimentGroupAttributes, ExperimentGroupCreationAttributes> implements ExperimentGroupAttributes {
    id: string;
    experimentId: string;
    name: string;
    ratio: number;
    variables: string;
    createdAt: number;
    updatedAt: number;
}
export default ExperimentGroup;
//# sourceMappingURL=ExperimentGroup.d.ts.map
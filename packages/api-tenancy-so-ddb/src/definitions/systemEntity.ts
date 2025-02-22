import { Entity, Table } from "dynamodb-toolbox";

interface Params {
    entityName: string;
    table: Table;
}
export const createSystemEntity = ({ entityName, table }: Params): Entity<any> => {
    return new Entity({
        table,
        name: entityName,
        attributes: {
            PK: {
                partitionKey: true
            },
            SK: {
                sortKey: true
            },
            GSI1_PK: {
                type: "string"
            },
            GSI1_SK: {
                type: "string"
            },
            version: {
                type: "string"
            }
        }
    });
};

import gql from "graphql-tag";

const ERROR_FIELDS = /*GraphQL*/ `
    {
        code
        message
    }
`;

const PAGE_ELEMENT_FIELDS = /*GraphQL*/ `
    {
        id
        name
        type
        category
        content
    }
`;

export const DELETE_PAGE_ELEMENT = gql`
    mutation PbDeletePageElement($id: ID!) {
        pageBuilder {
            deletePageElement(id: $id) {
                data ${PAGE_ELEMENT_FIELDS}
                error ${ERROR_FIELDS}
            }
        }
    }
`;

export const UPDATE_PAGE_ELEMENT = gql`
    mutation PbUpdatePageElement($id: ID!, $data: PbUpdatePageElementInput!) {
        pageBuilder {
            updatePageElement(id: $id, data: $data) {
                data ${PAGE_ELEMENT_FIELDS}
                error ${ERROR_FIELDS}
            }
        }
    }
`;

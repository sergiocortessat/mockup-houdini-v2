import { gql } from '@apollo/client';

export const ERASE_ORDER_MUTATION = gql`
  mutation easeOrder($id: String!) {
    eraseOrder(id: $id)
  }
`;

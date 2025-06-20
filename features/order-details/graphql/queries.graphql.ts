import { gql } from '@apollo/client';

import {
  ORDER_STATUS_FIELDS_FRAGMENT,
  TRACK_ORDER_STATUS_FRAGMENT,
} from '@/graphql/fragments.graphql';

export const GET_ORDER_STATUS = gql`
  query Status($id: String!) {
    status(id: $id) {
      ...OrderStatusFields
    }
  }
  ${ORDER_STATUS_FIELDS_FRAGMENT}
`;

export const ORDER_STATUS_SUBSCRIPTION = gql`
  subscription orderStatusSubscription($houdiniIds: [String!]!) {
    orderStatusSub(houdiniIds: $houdiniIds) {
      ...OrderStatusFields
    }
  }
  ${ORDER_STATUS_FIELDS_FRAGMENT}
`;

export const GET_MULTI_ORDER_STATUS = gql`
  query MultiStatus($multiId: String!) {
    multiStatus(multiId: $multiId) {
      ...OrderStatusFields
    }
  }
  ${ORDER_STATUS_FIELDS_FRAGMENT}
`;

export const GET_TRACK_ORDER_STATUS = gql`
  query TrackOrder($id: String!) {
    trackOrder(id: $id) {
      ...TrackOrderStatusFields
    }
  }
  ${TRACK_ORDER_STATUS_FRAGMENT}
`;

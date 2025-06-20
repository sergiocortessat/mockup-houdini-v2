import { gql } from '@apollo/client';

// Queries

export const SEND_CONTACT_FORM = gql`
  mutation sendContact(
    $email: String!
    $telegram: String!
    $discord: String!
    $twitter: String!
    $website: String!
    $description: String!
    $referral: String!
    $token: String!
    $tokenChain: String!
  ) {
    sendContact(
      email: $email
      telegram: $telegram
      discord: $discord
      twitter: $twitter
      website: $website
      description: $description
      referral: $referral
      token: $token
      tokenChain: $tokenChain
    )
  }
`;

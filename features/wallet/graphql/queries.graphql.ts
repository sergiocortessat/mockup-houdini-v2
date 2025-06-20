import { gql } from '@apollo/client';

export const SupportedChainsDocument = gql`
  query supportedChains {
    supportedChains {
      id
      name
      shortName
      shortNameV1
      chainId
      kind
      icon
      addressValidation
      tokenAddressValidation
      explorerUrl
      addressUrl
      enabled
      priority
    }
  }
`;

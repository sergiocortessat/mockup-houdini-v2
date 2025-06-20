import { generalErrorMappings } from '@/features/swap/utils/error-helpers/error-mapping/general-error-mapping';
import { ErrorMapping } from '@/features/swap/utils/error-helpers/types';

export const tronErrorMappings: ErrorMapping[] = [
  ...generalErrorMappings,
  {
    key: 'InvalidAddress',
    pattern: 'invalid address',
    translationKey: 'errors.tron.invalidAddress',
  },
];

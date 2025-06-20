/**
 * Validates an address using the chain's address validation pattern
 * @param address The address to validate
 * @param addressValidation The address validation pattern
 * @returns boolean indicating if the address matches the chain's pattern
 */
export function isAddressValid(
  address: string | undefined,
  addressValidation: string | undefined | null
): boolean {
  if (!address || !addressValidation) return false;

  try {
    const validationRegex = new RegExp(addressValidation);
    return validationRegex.test(address);
  } catch {
    return false;
  }
}

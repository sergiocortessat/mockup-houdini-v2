'use client';

const PARTNER_ID_KEY = 'houdini_partner_id';
const PARTNER_ID_EXPIRY_KEY = 'houdini_partner_id_expiry';
const EXPIRY_DURATION = 3 * 60 * 60 * 1000; // 3 hours in milliseconds

// We want the partnerId to be stored in the local storage for 3 hours so is accessible
// If user has set a partnerId, it checks if it exist, and updates the local storage accordingly
// If user has not set a partnerId, it checks if it exist in the local storage, and returns it
// If user has not set a partnerId, and it does not exist in the local storage, it returns an empty string
// If user has set a partnerId, and is different from the one in the local storage, it updates the local storage

// Get partner ID from URL or local storage
export const getPartnerId = () => {
  if (typeof window === 'undefined') return '';

  const queryParameters = new URLSearchParams(window.location.search);
  const urlPartnerId = queryParameters.get('partnerId');

  const storedPartnerId = getSetStoredPartnerId(urlPartnerId);
  return urlPartnerId || storedPartnerId || '';
};

// Get or set the partnerId in the local storage

const getSetStoredPartnerId = (newPartnerId?: string | null): string | null => {
  if (typeof window === 'undefined') return null;

  // Check for existing stored partner ID first
  const existingPartnerId = localStorage.getItem(PARTNER_ID_KEY);
  const expiry = localStorage.getItem(PARTNER_ID_EXPIRY_KEY);
  const isExpired = expiry ? Date.now() > parseInt(expiry, 10) : true;

  // If we have a new partner ID
  if (newPartnerId) {
    // Only update storage if:
    // 1. No existing partner ID, or
    // 2. Existing partner ID is expired, or
    // 3. New partner ID is different from existing
    if (!existingPartnerId || isExpired || existingPartnerId !== newPartnerId) {
      const expiryTime = Date.now() + EXPIRY_DURATION;
      localStorage.setItem(PARTNER_ID_KEY, newPartnerId);
      localStorage.setItem(PARTNER_ID_EXPIRY_KEY, expiryTime.toString());
    }
    return newPartnerId;
  }

  // If no new partner ID, return existing one if not expired
  if (isExpired) {
    // Clear expired data
    localStorage.removeItem(PARTNER_ID_KEY);
    localStorage.removeItem(PARTNER_ID_EXPIRY_KEY);
    return null;
  }

  return existingPartnerId;
};

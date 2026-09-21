/**
 * Certification Expiry & Validity Logic (Phase 7)
 *
 * Core Business Rules:
 * 1. An expired or inactive certification must NEVER render as current.
 * 2. If `isActive` is explicitly false, it is treated as inactive.
 * 3. If `expiryDate` is set, it must be on or after `referenceDate`.
 * 4. Certifications without an expiry date (ongoing certifications) are valid as long as `isActive` is true.
 * 5. Corrupt or unparseable expiry dates are rejected for safety.
 */

/**
 * Checks if a certification is active and currently unexpired.
 * @param {Object} cert
 * @param {string|Date} [referenceDate=new Date()]
 * @returns {boolean}
 */
export function isCertificationActiveAndValid(cert, referenceDate = new Date()) {
  if (!cert || typeof cert !== 'object') {
    return false;
  }

  if (cert.isActive === false) {
    return false;
  }

  if (cert.expiryDate) {
    const expiry = new Date(cert.expiryDate);
    if (isNaN(expiry.getTime())) {
      return false;
    }

    const ref = new Date(referenceDate);
    if (isNaN(ref.getTime())) {
      return false;
    }

    const expiryEnd = new Date(expiry);
    expiryEnd.setHours(23, 59, 59, 999);

    if (expiryEnd.getTime() < ref.getTime()) {
      return false;
    }
  }

  return true;
}

/**
 * Returns detailed compliance status for a certification.
 * @param {Object} cert
 * @param {string|Date} [referenceDate=new Date()]
 * @returns {{
 *   isValid: boolean,
 *   isExpired: boolean,
 *   isInactive: boolean,
 *   statusText: 'Active' | 'Expired' | 'Inactive' | 'Invalid Date'
 * }}
 */
export function getCertificationStatus(cert, referenceDate = new Date()) {
  if (!cert || typeof cert !== 'object') {
    return { isValid: false, isExpired: false, isInactive: true, statusText: 'Inactive' };
  }

  if (cert.isActive === false) {
    return { isValid: false, isExpired: false, isInactive: true, statusText: 'Inactive' };
  }

  if (cert.expiryDate) {
    const expiry = new Date(cert.expiryDate);
    if (isNaN(expiry.getTime())) {
      return { isValid: false, isExpired: false, isInactive: false, statusText: 'Invalid Date' };
    }

    const ref = new Date(referenceDate);
    const expiryEnd = new Date(expiry);
    expiryEnd.setHours(23, 59, 59, 999);

    if (expiryEnd.getTime() < ref.getTime()) {
      return { isValid: false, isExpired: true, isInactive: false, statusText: 'Expired' };
    }
  }

  return { isValid: true, isExpired: false, isInactive: false, statusText: 'Active' };
}

/**
 * Filters an array of certifications, returning only currently valid ones.
 * @param {Array} certifications
 * @param {string|Date} [referenceDate=new Date()]
 * @returns {Array}
 */
export function filterValidCertifications(certifications = [], referenceDate = new Date()) {
  if (!Array.isArray(certifications)) {
    return [];
  }
  return certifications.filter((cert) => isCertificationActiveAndValid(cert, referenceDate));
}

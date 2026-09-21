import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  isCertificationActiveAndValid,
  getCertificationStatus,
  filterValidCertifications,
} from '../src/lib/certifications.js';

describe('Phase 7: Certification Expiry & Validity Logic Unit Tests', () => {
  const referenceDate = new Date('2026-09-18T12:00:00Z');

  describe('isCertificationActiveAndValid', () => {
    it('returns true for active certification with a future expiry date', () => {
      const cert = {
        name: 'GOTS Certified',
        isActive: true,
        expiryDate: '2027-01-01',
      };
      assert.equal(isCertificationActiveAndValid(cert, referenceDate), true);
    });

    it('returns false for an expired certification (past expiry date)', () => {
      const cert = {
        name: 'ISO 9001:2015',
        isActive: true,
        expiryDate: '2025-05-10',
      };
      assert.equal(isCertificationActiveAndValid(cert, referenceDate), false);
    });

    it('returns true on the exact expiration day (valid through end of day)', () => {
      const cert = {
        name: 'Expiring Today Certification',
        isActive: true,
        expiryDate: '2026-09-18',
      };
      assert.equal(isCertificationActiveAndValid(cert, referenceDate), true);
    });

    it('returns false for inactive certification even if expiry date is in future', () => {
      const cert = {
        name: 'Suspended Audit Certification',
        isActive: false,
        expiryDate: '2028-12-31',
      };
      assert.equal(isCertificationActiveAndValid(cert, referenceDate), false);
    });

    it('returns true for ongoing active certification without expiry date', () => {
      const cert = {
        name: 'Sedex SMETA Audit',
        isActive: true,
      };
      assert.equal(isCertificationActiveAndValid(cert, referenceDate), true);
    });

    it('safely rejects corrupt or unparseable expiry dates', () => {
      const cert = {
        name: 'Bad Date Certification',
        isActive: true,
        expiryDate: 'NOT_A_VALID_DATE',
      };
      assert.equal(isCertificationActiveAndValid(cert, referenceDate), false);
    });

    it('returns false for null, undefined, or non-object arguments', () => {
      assert.equal(isCertificationActiveAndValid(null, referenceDate), false);
      assert.equal(isCertificationActiveAndValid(undefined, referenceDate), false);
      assert.equal(isCertificationActiveAndValid('invalid', referenceDate), false);
    });
  });

  describe('getCertificationStatus', () => {
    it('returns Active for valid unexpired certification', () => {
      const cert = { isActive: true, expiryDate: '2027-10-15' };
      const status = getCertificationStatus(cert, referenceDate);
      assert.equal(status.isValid, true);
      assert.equal(status.statusText, 'Active');
      assert.equal(status.isExpired, false);
      assert.equal(status.isInactive, false);
    });

    it('returns Expired for certification with past expiry date', () => {
      const cert = { isActive: true, expiryDate: '2024-01-01' };
      const status = getCertificationStatus(cert, referenceDate);
      assert.equal(status.isValid, false);
      assert.equal(status.statusText, 'Expired');
      assert.equal(status.isExpired, true);
    });

    it('returns Inactive when isActive is false', () => {
      const cert = { isActive: false, expiryDate: '2028-01-01' };
      const status = getCertificationStatus(cert, referenceDate);
      assert.equal(status.isValid, false);
      assert.equal(status.statusText, 'Inactive');
      assert.equal(status.isInactive, true);
    });
  });

  describe('filterValidCertifications', () => {
    it('strictly purges expired and inactive certifications from the output grid', () => {
      const mixedList = [
        { _id: '1', name: 'Valid GOTS', isActive: true, expiryDate: '2027-06-30' },
        { _id: '2', name: 'Expired ISO', isActive: true, expiryDate: '2025-01-01' },
        { _id: '3', name: 'Revoked Audit', isActive: false, expiryDate: '2028-01-01' },
        { _id: '4', name: 'Ongoing Sedex', isActive: true },
        { _id: '5', name: 'Expired Fair Trade', isActive: true, expiryDate: '2026-01-01' },
      ];

      const validList = filterValidCertifications(mixedList, referenceDate);

      // Only items 1 and 4 should be returned
      assert.equal(validList.length, 2);
      assert.deepEqual(
        validList.map((c) => c._id),
        ['1', '4']
      );

      // Verify that no expired or inactive cert rendered as current
      for (const item of validList) {
        assert.equal(isCertificationActiveAndValid(item, referenceDate), true);
      }
    });

    it('handles empty arrays or invalid inputs gracefully', () => {
      assert.deepEqual(filterValidCertifications([], referenceDate), []);
      assert.deepEqual(filterValidCertifications(null, referenceDate), []);
      assert.deepEqual(filterValidCertifications(undefined, referenceDate), []);
    });
  });
});

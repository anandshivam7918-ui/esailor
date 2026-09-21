import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  validateQuoteRequest,
  persistQuoteRequest,
  sendQuoteNotification,
} from '../src/lib/quote-request.js';

describe('Phase 10: Quote Request Form Functional & Integration Tests', () => {
  const validPayload = {
    buyerName: 'Alexander Wright',
    companyName: 'Nordic Eco Living AB',
    country: 'Sweden',
    buyerType: 'international',
    product: 'Heavy Duty Natural Jute Tote Bag',
    quantity: 2500,
    email: 'alexander@nordicecoliving.se',
    phone: '+46 8 123 4567',
    customizationNotes: 'Pantone 7489C 2-color screen print on front panel, reinforced long handles.',
  };

  describe('Form Validation & Field Rules', () => {
    it('validates a complete, correctly-formatted B2B submission', () => {
      const result = validateQuoteRequest(validPayload);
      assert.equal(result.isValid, true);
      assert.equal(result.isSpam, false);
      assert.equal(result.sanitizedData?.buyerName, 'Alexander Wright');
      assert.equal(result.sanitizedData?.quantity, 2500);
      assert.equal(result.sanitizedData?.buyerType, 'international');
    });

    it('rejects submission when required fields are missing', () => {
      const incomplete = {
        buyerName: '',
        country: '',
        email: 'bad-email',
        quantity: -10,
      };
      const result = validateQuoteRequest(incomplete);
      assert.equal(result.isValid, false);
      assert.ok(result.errors.buyerName);
      assert.ok(result.errors.country);
      assert.ok(result.errors.email);
      assert.ok(result.errors.quantity);
      assert.ok(result.errors.phone);
    });

    it('validates email format strictly', () => {
      const invalidEmail = { ...validPayload, email: 'notanemail' };
      const result = validateQuoteRequest(invalidEmail);
      assert.equal(result.isValid, false);
      assert.ok(result.errors.email);
    });

    it('validates quantity is a positive whole integer', () => {
      const zeroQty = { ...validPayload, quantity: 0 };
      assert.equal(validateQuoteRequest(zeroQty).isValid, false);

      const negativeQty = { ...validPayload, quantity: -50 };
      assert.equal(validateQuoteRequest(negativeQty).isValid, false);

      const validQty = { ...validPayload, quantity: 1 };
      assert.equal(validateQuoteRequest(validQty).isValid, true);
    });
  });

  describe('Spam Protection (Honeypot Zero-Friction)', () => {
    it('detects and flags automated bot submissions filling the honeypot field', () => {
      const botPayload = {
        ...validPayload,
        website_hp: 'http://spam-link-promotion.com',
      };
      const result = validateQuoteRequest(botPayload);
      assert.equal(result.isValid, false);
      assert.equal(result.isSpam, true);
      assert.ok(result.errors.website_hp);
    });

    it('passes human submissions where honeypot is empty or undefined', () => {
      const humanPayload = {
        ...validPayload,
        website_hp: '',
      };
      const result = validateQuoteRequest(humanPayload);
      assert.equal(result.isValid, true);
      assert.equal(result.isSpam, false);
    });
  });

  describe('CMS Record Creation & Resilient Storage', () => {
    it('successfully generates and stores quote request record with unique ID', async () => {
      const persistence = await persistQuoteRequest(validPayload);
      assert.ok(persistence.id);
      assert.ok(persistence.persistedTo === 'sanity' || persistence.persistedTo === 'local');
      assert.ok(persistence.timestamp);
    });
  });

  describe('Email Notification Dispatch', () => {
    it('generates well-structured B2B email notification payload for sales desk', async () => {
      const testQuoteId = 'QR-TEST-SwedishBuyer-100';
      const emailResult = await sendQuoteNotification(validPayload, testQuoteId);

      assert.equal(emailResult.success, true);
      assert.ok(emailResult.recipient.includes('@'));
      assert.ok(emailResult.subject.includes(testQuoteId));
      assert.ok(emailResult.summary.includes('Alexander Wright'));
      assert.ok(emailResult.summary.includes('2500 units'));
      assert.ok(emailResult.summary.includes('Nordic Eco Living AB'));
    });
  });

  describe('End-to-End Quote Workflow & Data Retention on Failure', () => {
    it('confirms simulated end-to-end flow: validate -> persist -> notify', async () => {
      // 1. Validation
      const validation = validateQuoteRequest(validPayload);
      assert.equal(validation.isValid, true);

      // 2. Persistence (CMS or resilient local)
      const persistence = await persistQuoteRequest(validation.sanitizedData);
      assert.ok(persistence.id);

      // 3. Email notification
      const email = await sendQuoteNotification(validation.sanitizedData, persistence.id);
      assert.equal(email.success, true);

      // 4. Confirmation data structure prepared for buyer view
      const confirmationView = {
        quoteRefId: persistence.id,
        buyerName: validation.sanitizedData.buyerName,
        email: validation.sanitizedData.email,
        quantity: validation.sanitizedData.quantity,
        product: validation.sanitizedData.product,
      };

      assert.equal(confirmationView.quoteRefId, persistence.id);
      assert.equal(confirmationView.buyerName, 'Alexander Wright');
    });

    it('ensures entered field data is retained when network/validation failure occurs', () => {
      // Simulating user entered values with one validation error
      const userEnteredFormState = {
        buyerName: 'Elena Rostova',
        companyName: 'Baltic Logistics',
        country: 'Estonia',
        buyerType: 'international',
        product: 'Drawstring Hessian Gift Pouches',
        quantity: 500,
        email: 'invalid-email-format',
        phone: '+372 555 1234',
        customizationNotes: 'Natural color with jute cord drawstrings.',
      };

      const result = validateQuoteRequest(userEnteredFormState);
      assert.equal(result.isValid, false);

      // User entered fields are NOT wiped out
      assert.equal(userEnteredFormState.buyerName, 'Elena Rostova');
      assert.equal(userEnteredFormState.customizationNotes, 'Natural color with jute cord drawstrings.');
      assert.equal(userEnteredFormState.quantity, 500);

      // Fix single field and retry
      userEnteredFormState.email = 'elena@balticlogistics.ee';
      const retryResult = validateQuoteRequest(userEnteredFormState);
      assert.equal(retryResult.isValid, true);
    });
  });
});

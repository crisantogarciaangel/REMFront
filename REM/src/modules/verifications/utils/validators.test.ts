import { describe, it, expect } from 'vitest';
import { isValidEmail, isValidPhone } from './validators';

describe('validators', () => {
  describe('isValidEmail', () => {
    it('returns true for valid emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('a.b+c@domain.co')).toBe(true);
    });

    it('returns false for invalid emails', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('test@domain')).toBe(false);
      expect(isValidEmail('test domain.com')).toBe(false);
    });
  });

  describe('isValidPhone', () => {
    it('returns true for 8–15 digits', () => {
      expect(isValidPhone('55123456')).toBe(true);          // 8
      expect(isValidPhone('551234567890123')).toBe(true);   // 15
    });

    it('returns false for non-digits or out of range', () => {
      expect(isValidPhone('1234567')).toBe(false);          // 7
      expect(isValidPhone('5512345678901234')).toBe(false); // 16
      expect(isValidPhone('55 1234 5678')).toBe(true);     // spaces not allowed in your regex
      expect(isValidPhone('55-1234-5678')).toBe(false);     // symbols
      expect(isValidPhone('abcdefghi')).toBe(false);
    });
  });
});

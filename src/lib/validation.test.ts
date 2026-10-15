import { describe, expect, it } from 'vitest';
import { contactInfoSchema } from './validation';
import { localDateString } from './utils';

const valid = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  phone: '(555) 123-4567',
  deliveryMethod: 'pickup' as const,
  targetDate: localDateString(14),
  notes: '',
};

const messages = (input: unknown) => {
  const result = contactInfoSchema.safeParse(input);
  return result.success ? [] : result.error.issues.map((i) => i.message);
};

describe('contactInfoSchema', () => {
  it('accepts a complete contact', () => {
    expect(contactInfoSchema.safeParse(valid).success).toBe(true);
  });

  it('requires a 10-digit phone number', () => {
    expect(messages({ ...valid, phone: '(555) 123' })).toContain('Please enter a valid 10-digit phone number');
  });

  it('enforces the 10-day lead time', () => {
    expect(messages({ ...valid, targetDate: localDateString(9) })).toContain('Please choose a date at least 10 days from today');
    expect(contactInfoSchema.safeParse({ ...valid, targetDate: localDateString(10) }).success).toBe(true);
  });

  it('reports a missing date as missing rather than too early', () => {
    expect(messages({ ...valid, targetDate: '' })[0]).toBe('Please select a target date');
  });
});

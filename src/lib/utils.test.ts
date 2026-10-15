import { describe, expect, it } from 'vitest';
import { formatPhone, localDateString } from './utils';

describe('formatPhone', () => {
  it.each([
    ['', ''],
    ['5', '(5'],
    ['555', '(555'],
    ['5551', '(555) 1'],
    ['5551234', '(555) 123-4'],
    ['5551234567', '(555) 123-4567'],
    ['(555) 123-45678999', '(555) 123-4567'],
    ['555.123.4567', '(555) 123-4567'],
  ])('formats %j as %j', (input, expected) => {
    expect(formatPhone(input)).toBe(expected);
  });
});

describe('localDateString', () => {
  it('uses the local calendar date, not UTC', () => {
    // 11pm local time must not roll over to the next day the way toISOString() would west of UTC
    const lateEvening = new Date(2026, 9, 14, 23, 30);
    expect(localDateString(0, lateEvening)).toBe('2026-10-14');
  });

  it('adds days across month and year boundaries', () => {
    expect(localDateString(10, new Date(2026, 11, 25))).toBe('2027-01-04');
  });
});

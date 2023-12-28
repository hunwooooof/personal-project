import { expect, test } from 'vitest';
import { getQuarterRange } from './CalendarButton';

test('getQuarterRange()', () => {
  expect(getQuarterRange(1)).toBe('Jan - Mar');
  expect(getQuarterRange(2)).toBe('Apr - Jun');
  expect(getQuarterRange(0)).toBe('Jan - Mar');
  expect(getQuarterRange(5)).toBe('Jan - Mar');
});

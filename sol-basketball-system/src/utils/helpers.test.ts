import { expect, test } from 'vitest';
import { calculateAge, extractVideoId, formatShowDate, getCurrentQuarter, getDateRangeForQuarter } from './helpers';

test('formatShowDate()', () => {
  expect(formatShowDate('1998-03-10')).toBe('03/10');
});

test('getCurrentQuarter()', () => {
  const q1 = new Date('2010-02-28');
  expect(getCurrentQuarter(q1)).toBe(1);
  const q2 = new Date('2023-06-30');
  expect(getCurrentQuarter(q2)).toBe(2);
});

test('getDateRangeForQuarter()', () => {
  expect(getDateRangeForQuarter(1)).toStrictEqual({
    firstDate: '-01-01',
    lastDate: '-03-31',
  });
  expect(getDateRangeForQuarter(0)).toStrictEqual({
    firstDate: '-01-01',
    lastDate: '-03-31',
  });
});

test('calculateAge()', () => {
  expect(calculateAge('1998-03-10')).toBe(25);
});

test('extractVideoId()', () => {
  const youtubeURL1 = 'https://www.youtube.com/watch?v=JhcCBQXUYgM';
  const youtubeURL2 = 'https://youtu.be/jUNz-uTF--E?si=al4vSOvPEk3ieOcJ';
  expect(extractVideoId(youtubeURL1)).toBe('JhcCBQXUYgM');
  expect(extractVideoId(youtubeURL2)).toBe('jUNz-uTF--E');
});

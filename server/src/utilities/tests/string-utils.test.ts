import { describe, it, expect } from 'vitest';

import { normalize, isNonEmpty } from '../string-utils';

describe('normalize', () => {
  it.each([
    { input: 'Lemon', output: 'lemon' },
    { input: ' Lemon ', output: 'lemon'},
    { input: 'RED ONION', output: 'red onion' },
    { input: 'Red Onion', output: 'red onion' }
  ])('normalizes "$input"', ({input, output}) => {
    expect(normalize(input)).toBe(output);
  })

  it('is idempotent', () => {
    const value = ' Lemon ';
    expect(normalize(normalize(value))).toBe(normalize(value));
  })
}) 

describe('isNonEmpty', () => {
  it.each([
    { input: '', output: false},
    { input: ' ', output: true },
    { input: 'a', output: true},
    { input: ' a ', output: true}
  ])('returns "$output" for "$input"', ({input, output}) => {
    expect(isNonEmpty(input)).toBe(output)
  })
})

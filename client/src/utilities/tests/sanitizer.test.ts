import { describe, it, expect } from "vitest";

import { sanitizePage, sanitizeLimit } from "../sanitizer";

describe("sanitizePage", () => {
  it.each([
    { input: 4, output: 4 },
    { input: 2.5, output: 2 },
    { input: 0, output: 1},
    { input: -2.5, output: 1 },
    { input: "2.5", output: 2 },
    { input: "-2.5", output: 1 },
    { input: null, output: 1 },
    { input: undefined, output: 1 },
    { input: Infinity, output: 1 }
  ])('should return "$output" for "$input"', ({ input, output }) => {
    expect(sanitizePage(input)).toBe(output);
  })
})

describe("sanitizeLimit", () => {
  it.each([
    { input: 48, output: 48 },
    { input: 24, output: 24 },
    { input: 27, output: 24 },
    { input: "24", output: 24}
  ])('returns "$output" for "$input"', ({ input, output }) => {
    expect(sanitizeLimit(input)).toBe(output);
  })
})
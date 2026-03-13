import { describe, it, expect } from "vitest";

import { isErrorWithStatus } from "../error-guard";

import type { ErrorWithStatus } from "../../types/auth-types";

const error = new Error("Something's wrong");
const errorWithStatus = new Error("Something's wrong") as ErrorWithStatus;
errorWithStatus.status = 400
const errorWithFalseStatus = new Error("Something's wrong") as Error & { status?: string };
errorWithFalseStatus.status = 'four hundred';
const errorWithNaNStatus = new Error("Something's wrong") as Error & { status?: unknown };
errorWithNaNStatus.status = NaN;
const nonError = { key: "value", status: 400 }

describe( isErrorWithStatus, () => {
  it.each([
    { input: errorWithStatus, output: true },
    { input: error, output: false},
    { input: errorWithFalseStatus, output: false},
    { input: errorWithNaNStatus, output: false},
    { input: nonError, output: false }
  ])('returns "$output" for "$input"', ({input, output}) => {
    expect(isErrorWithStatus(input)).toBe(output)
  })
})
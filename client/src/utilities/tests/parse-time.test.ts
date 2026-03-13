import { describe, it, expect } from "vitest";

import { parseDuration, parseTotalDuration, durationToString } from "../parse-time";

import type { RecipeCardT } from "../../../../data/recipes/types/recipe-types";

const structuredOutput1 = { daysNum: 0, hoursNum: 0, minsNum: 30 }
const structuredOutput2 = { daysNum: 0, hoursNum: 1, minsNum: 20 }
const structuredOutput3 = { daysNum: 1, hoursNum: 12, minsNum: 10 }
const structuredOutput4 = { daysNum: 0, hoursNum: 1, minsNum: 0 }
const structuredOutput5 = { daysNum: 1, hoursNum: 0, minsNum: 0 }
const structuredOutput6 = { daysNum: 1, hoursNum: 2, minsNum: 10 }

describe("parseDuration", () => {  
  it("returns a structured object when input is a valid ISO duration string", () => {
    expect(parseDuration("PT30M")).toEqual(structuredOutput1);
    expect(parseDuration("PT1H20M")).toEqual(structuredOutput2);
    expect(parseDuration("P1DT12H10M")).toEqual(structuredOutput3);
  })

  it("returns null when input is empty or invalid", () => {
    expect(parseDuration()).toBeNull();
    expect(parseDuration("")).toBeNull();
    expect(parseDuration(undefined)).toBeNull();
    expect(parseDuration("string")).toBeNull();
    expect(parseDuration("PT")).toBeNull();
  })

  it("returns a structured object when input is a poorly-formatted ISO duration string", () => {
    expect(parseDuration(" PT30M ")).toEqual(structuredOutput1);
    expect(parseDuration("pt1h20m")).toEqual(structuredOutput2);
    expect(parseDuration(" p1Dt12H10M ")).toEqual(structuredOutput3);
  })
})

describe("parseTotalDuration", () => {
  it("returns a structured object that reflects the value of totalTime when it is present as an input", () => {
    expect(parseTotalDuration({ totalTime: "PT30M", prepTime: "PT20M", cookTime: "PT20M"} as RecipeCardT)).toEqual(structuredOutput1);
  })

  it("returns a structured object that falls back to the sum value of prepTime and cookTime when totalTime input is not present", () => {
    expect(parseTotalDuration({ prepTime: "PT35M", cookTime: "PT45M" } as RecipeCardT)).toEqual(structuredOutput2);
    expect(parseTotalDuration({ prepTime: "PT23H", cookTime: "PT13H10M" } as RecipeCardT)).toEqual(structuredOutput3);
    expect(parseTotalDuration({ prepTime: "PT20M", cookTime: "PT40M" } as RecipeCardT)).toEqual(structuredOutput4);
    expect(parseTotalDuration({ prepTime: "PT20H30M", cookTime: "PT3H30M" } as RecipeCardT)).toEqual(structuredOutput5);
    expect(parseTotalDuration({ prepTime: "PT22H30M", cookTime: "PT3H40M" } as RecipeCardT)).toEqual(structuredOutput6);
  })

  it("returns null when totalTime, prepTime and cookTime inputs are not present", () => {
    expect(parseTotalDuration({} as RecipeCardT)).toBeNull();
    expect(parseTotalDuration({ totalTime: "PT", prepTime: "PT", cookTime: "PT" } as RecipeCardT)).toBeNull();
    expect(parseTotalDuration({ totalTime: "", prepTime: "", cookTime: "" } as RecipeCardT)).toBeNull();
  })
})

describe("durationToString", () => {
  it("returns a valid duration string when input is a structured object.", () => {
    expect(durationToString(structuredOutput1)).toBe("30m");
    expect(durationToString(structuredOutput2)).toBe("1h, 20m");
    expect(durationToString(structuredOutput3)).toBe("1d, 12h, 10m");
  })

  it("returns null when input is empty/invalid.", () => {
    expect(durationToString()).toBeNull();
    expect(durationToString({ daysNum: 0, hoursNum: 0, minsNum: 0})).toBeNull();
  })
})

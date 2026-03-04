import { describe, it, expect } from "vitest";

import { nameAggregator } from "../name-aggregator";

import type { GenericIngredientT } from "../../../../data/ingredients/types/ingredient-types";

describe('nameAggregator', () => {
  it.each([
    { name: "when no altNames exists", input: [{ name: "Lemon" }, { name: "RED ONION" }], output: ["lemon", "red onion"]},
    { name: "when input contains nested altNames arrays", input: [{ name: "bacon", altNames: ["streaky bacon", "back bacon", "smoked bacon"]}, { name: "red onion" }], output: ["bacon", "streaky bacon", "back bacon", "smoked bacon", "red onion"]},
    { name: "when input contains blank or whitespace-only values", input: [{ name: "lemon" }, { name: "spring onion", altNames: [" ", ""]}, { name: ""}, { name: "  "}], output: ["lemon", "spring onion"]},
  ])("returns '$output' '$name'", ({input, output}) => {
    expect(nameAggregator(input as GenericIngredientT[])).toEqual(output);
  })

  it("does not mutate the input", () => {
    const input = [{ name: "lemon" }, { name: "green onion", altNames: ["spring onion", "salad onion"]}, { name: "broccoli" }];

    const before = structuredClone(input);
    nameAggregator(input as GenericIngredientT[]);
    expect(input).toEqual(before);
  })
})
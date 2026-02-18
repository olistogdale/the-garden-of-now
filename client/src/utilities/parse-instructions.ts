import type { InstructionT } from "../../../data/recipes/types/recipe-types";

export function parseInstructions(instructionData: InstructionT[]): string[] {
  return instructionData.map((instruction) => {
    return instruction.text;
  });
}
import type { RecipeCardT } from "../../../data/recipes/types/recipe-types";

type DurationOutput = {
  durationMins: number,
  durationString: string
}

const DURATION_RE = /^P(?:(?<days>\d+)D)?(?:T(?:(?<hours>\d+)H)?(?:(?<minutes>\d+)M)?)?$/

function parseDuration(value?: string): DurationOutput | null {
  if (!value) return null;

  const str = value.trim().toUpperCase();
  if (!str) return null;

  const match = str.match(DURATION_RE);

  if (match?.groups) {
    const {
      days = "0",
      hours = "0",
      minutes = "0"
    } = match.groups;

    const durationMins = (Number(days) * 1440) + (Number(hours) * 60) + Number(minutes);
    const durationString = `${Number(days) && `${days} days, `}${Number(hours) && `${hours} hours, `}${Number(minutes) && `${minutes} minutes`}`

    return {
      durationMins,
      durationString
    }
  } else {
    return null;
  }
}

export function parseTotalTime(recipe: RecipeCardT): string | number | null {
  const total = parseDuration(recipe.totalTime);
  if (total !== null) return total.durationMins;

  const prep = parseDuration(recipe.prepTime);
  const cook = parseDuration(recipe.cookTime);

  if (prep === null && cook === null) return null;
  return (prep?.durationMins ?? 0) + (cook?.durationMins ?? 0);
}
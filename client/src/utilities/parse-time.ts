import type { RecipeCardT } from "../../../data/recipes/types/recipe-types";

type DurationData = {
  daysNum: number,
  hoursNum: number,
  minsNum: number
}

const DURATION_RE = /^P(?:(?<days>\d+)D)?T(?:(?<hours>\d+)H)?(?:(?<mins>\d+)M)?$/

export function parseDuration(value?: string): DurationData | null {
  if (!value) return null;

  const str = value.trim().toUpperCase();
  if (!str) return null;

  const match = str.match(DURATION_RE);

  if (match?.groups && match[0] !== "PT") {
    const {
      days = "0",
      hours = "0",
      mins = "0"
    } = match.groups;
    
    return {
      daysNum: Number(days),
      hoursNum: Number(hours),
      minsNum: Number(mins)
    }
  } else {
    return null;
  }
}

export function parseTotalDuration(recipe: RecipeCardT): DurationData | null {
  const total = parseDuration(recipe.totalTime);
  if (total) return total;

  const prep = parseDuration(recipe.prepTime);
  const cook = parseDuration(recipe.cookTime);

  let daysNum = (prep?.daysNum ?? 0) + (cook?.daysNum ?? 0);
  let hoursNum = (prep?.hoursNum ?? 0) + (cook?.hoursNum ?? 0);
  let minsNum = (prep?.minsNum ?? 0) + (cook?.minsNum ?? 0);

  if (minsNum >= 60) {
    hoursNum += Math.floor(minsNum / 60);
    minsNum %= 60;
  }

  if (hoursNum >= 24) {
    daysNum += Math.floor(hoursNum / 24);
    hoursNum %= 24
  }

  if (daysNum === 0 && hoursNum === 0 && minsNum === 0) return null;

  return {
    daysNum,
    hoursNum,
    minsNum
  }
}

export function durationToString(duration?: DurationData | null): string | null {
  if (!duration) return null;
  
  const units: string[] = [];
  const days = duration.daysNum;
  const hours = duration.hoursNum;
  const mins = duration.minsNum;

  if (days === 0 && hours === 0 && mins === 0) return null;

  if (days) units.push(`${days}d`);
  if (hours) units.push(`${hours}h`);
  if (mins) units.push(`${mins}m`);

  return units.join(", ");
};
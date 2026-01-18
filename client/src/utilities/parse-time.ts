import type { RecipeCardT } from "../../../data/recipes/types/recipe-types";

function parseDurationToMinutes(value?: string): number | null {
  if (!value) return null;

  const s = value.trim().toLowerCase();
  if (!s) return null;

  // Examples handled:
  // "45 mins", "45 min", "1 hr", "1 hour", "1 hr 20 mins", "1h 20m", "90 mins"
  // Also tolerates extra words: "about 1 hr 15 mins"
  const hourMatches = [...s.matchAll(/(\d+)\s*(h|hr|hrs|hour|hours)\b/g)];
  const minMatches = [...s.matchAll(/(\d+)\s*(m|min|mins|minute|minutes)\b/g)];

  let hours = 0;
  let mins = 0;

  for (const m of hourMatches) hours += Number(m[1]);
  for (const m of minMatches) mins += Number(m[1]);

  // If it didn't match "hr/min" formats, fall back to raw number as minutes.
  if (hourMatches.length === 0 && minMatches.length === 0) {
    const raw = s.match(/(\d+)/);
    if (!raw) return null;
    return Number(raw[1]);
  }

  return hours * 60 + mins;
}

function formatMinutes(mins: number): string {
  if (mins < 60) return `${mins} min${mins === 1 ? '' : 's'}`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (m === 0) return `${h} hr${h === 1 ? '' : 's'}`;
  return `${h} hr${h === 1 ? '' : 's'} ${m} min${m === 1 ? '' : 's'}`;
}

export function parseTime(recipe: RecipeCardT): string | null {
  const total = parseDurationToMinutes(recipe.totalTime);
  if (total !== null) return formatMinutes(total);

  const prep = parseDurationToMinutes(recipe.prepTime);
  const cook = parseDurationToMinutes(recipe.cookTime);

  if (prep === null && cook === null) return null;
  return formatMinutes((prep ?? 0) + (cook ?? 0));
}
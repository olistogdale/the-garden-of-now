export function parseSkillLevel(skillLevel?: string): string | null {
  if (!skillLevel) return null;
  const s = skillLevel.trim().toLowerCase();
  if (!s) return null;

  if (s.includes('easy')) return 'Easy';
  if (s.includes('medium') || s.includes('intermediate')) return 'Medium';
  if (s.includes('hard') || s.includes('difficult')) return 'Hard';

  // If your data already uses "Easy/Medium/Hard", this preserves it nicely:
  return skillLevel.trim();
}
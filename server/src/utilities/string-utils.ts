export const normalize = function(string: string) {
  return string.trim().toLowerCase();
}

export const isNonEmpty = function(string: string) {
  return string.length > 0;
}
exports.capitalizeFirstLetterAndRemoveWhitespace = (s) => {
  if (s === null || s === undefined) return s;
  s = s.replace(/\s+/g, '').toLowerCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
};

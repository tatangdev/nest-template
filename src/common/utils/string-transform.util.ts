/**
 * Converts a camelCase or PascalCase string into spaced words with capitalization.
 * Removes "controller" from the string and ensures the first word is capitalized.
 * @param inputString The input string.
 * @returns The formatted title-case string.
 */
export function convertCamelCaseToWords(inputString: string): string {
  const spacedString = inputString.replace(/([A-Z])/g, ' $1');
  const cleanedString = spacedString.replace(/controller/gi, '');

  return (
    cleanedString.charAt(0).toUpperCase() +
    cleanedString.slice(1).trim()
  );
}

/**
 * Converts a string to title case (capitalizing the first letter of each word).
 * @param inputString The input string.
 * @returns The formatted title-case string.
 */
export function convertToTitleCase(inputString: string): string {
  return inputString
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export const capitalizeFirstLetter = (str: string) =>
  `${str[0].toUpperCase()}${str.substring(1)}`;

export const capitalizeFirstLetterOnly = (str: string) =>
  capitalizeFirstLetter(str.toLowerCase());

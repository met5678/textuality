export type ThemeColorKey =
  | 'colorPrimary'
  | 'colorSecondary'
  | 'colorAccentLight'
  | 'colorAccentMid'
  | 'colorAccentDark';

interface ThemeStyles {
  colorPrimary: string;
  colorSecondary: string;
  colorAccentLight: string;
  colorAccentMid: string;
  colorAccentDark: string;
  fontTitle: string;
  fontTitleCompressed?: string;
  fontTitleCondensed?: string;
  fontBody: string;
  currency: string;
}

export const themes: Record<'normal' | 'space', ThemeStyles> = {
  normal: {
    colorPrimary: '#d01935', // red
    colorSecondary: '#fea70a', //yellow

    colorAccentLight: '#fea70a', //yellow
    colorAccentMid: '#537c43', // green
    colorAccentDark: '#121639', //navy

    fontTitle: 'gin, serif',
    fontBody: 'rockwell-nova, sans-serif',

    currency: 'BB',
  },
  space: {
    colorPrimary: '#ff01ff', // magenta
    colorSecondary: '#04ffff', // teal

    colorAccentLight: '#ff9404', // gold
    colorAccentMid: '#abd301', // lime green
    colorAccentDark: '#0000fe', //blue

    fontTitle: 'magistral, sans-serif',
    fontTitleCompressed: 'magistral-compressed, sans-serif',
    fontTitleCondensed: 'magistral-condensed, sans-serif',
    fontBody: 'univia-pro, serif',

    currency: 'VC',
  },
};

export type Theme = keyof typeof themes;

export function getThemeVars(theme: Theme): React.CSSProperties {
  const t = themes[theme];
  return {
    '--color-primary': t.colorPrimary,
    '--color-secondary': t.colorSecondary,

    '--color-accent-light': t.colorAccentLight,
    '--color-accent-mid': t.colorAccentMid,
    '--color-accent-dark': t.colorAccentDark,

    '--font-title': t.fontTitle,
    '--font-title-condensed': t.fontTitleCondensed ?? t.fontTitle,
    '--font-title-compressed':
      t.fontTitleCompressed ?? t.fontTitleCondensed ?? t.fontTitle,
    '--font-body': t.fontBody,
  } as React.CSSProperties;
}

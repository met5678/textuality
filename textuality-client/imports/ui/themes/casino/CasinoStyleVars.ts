interface ThemeStyles {
  colorPrimary: string;
  colorSecondary: string;
  colorTertiary: string;
  colorQuarternary: string;
  colorHighlight?: string;
  fontTitle: string;
  fontTitleCompressed?: string;
  fontTitleCondensed?: string;
  fontBody: string;
}

export const themes: Record<'normal' | 'space', ThemeStyles> = {
  normal: {
    colorPrimary: '#d01935',
    colorSecondary: '#fea70a',
    colorTertiary: '#537c43',
    colorQuarternary: '#121639',

    colorHighlight: '#fea70a',

    fontTitle: 'gin, serif',
    fontBody: 'rockwell-nova, sans-serif',
  },
  space: {
    colorPrimary: '#ff01ff',
    colorSecondary: '#ff9404',
    colorTertiary: '#abd301',
    colorQuarternary: '#0000fe',

    colorHighlight: '#abd301',

    fontTitle: 'magistral, sans-serif',
    fontTitleCompressed: 'magistral-compressed, sans-serif',
    fontTitleCondensed: 'magistral-condensed, sans-serif',
    fontBody: 'univia-pro, serif',
  },
};

export type Theme = keyof typeof themes;

export function getThemeVars(theme: Theme): React.CSSProperties {
  const t = themes[theme];
  return {
    '--color-primary': t.colorPrimary,
    '--color-secondary': t.colorSecondary,
    '--color-tertiary': t.colorTertiary,
    '--color-quarternary': t.colorQuarternary,

    '--color-highlight': t.colorHighlight,

    '--font-title': t.fontTitle,
    '--font-title-condensed': t.fontTitleCondensed ?? t.fontTitle,
    '--font-title-compressed':
      t.fontTitleCompressed ?? t.fontTitleCondensed ?? t.fontTitle,
    '--font-body': t.fontBody,
  } as React.CSSProperties;
}

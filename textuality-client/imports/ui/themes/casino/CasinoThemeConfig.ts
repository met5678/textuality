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
  slotEmojis: { id: string; url: string }[];
  slotHackerVids: string[];
}

export type ThemeColorKey =
  | 'colorPrimary'
  | 'colorSecondary'
  | 'colorAccentLight'
  | 'colorAccentMid'
  | 'colorAccentDark';

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

    slotEmojis: [
      { id: '🥴', url: `/images/emojis/normal/emoji-clover.svg` },
      { id: '🍒', url: `/images/emojis/normal/emoji-cherries.svg` },
      { id: '💣', url: `/images/emojis/normal/emoji-bomb.svg` },
      { id: '🍆', url: `/images/emojis/normal/emoji-seven.svg` },
      { id: '🍑', url: `/images/emojis/normal/emoji-diamond.svg` },
      { id: '💦', url: `/images/emojis/normal/emoji-watermelon.svg` },
    ],
    slotHackerVids: [
      '/casino/videos/hackerwin-1.mp4',
      '/casino/videos/hackerwin-2.mp4',
      '/casino/videos/hackerwin-3.mp4',
    ],
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

    slotEmojis: [
      { id: '💣', url: `/images/emojis/space/fv.svg` },
      { id: '🥴', url: `/images/emojis/space/planet.svg` },
      { id: '🍒', url: `/images/emojis/space/satellite.svg` },
      { id: '🍆', url: `/images/emojis/space/rocket.svg` },
      { id: '🍑', url: `/images/emojis/space/alien.svg` },
      { id: '💦', url: `/images/emojis/space/saucer.svg` },
    ],
    slotHackerVids: [
      '/casino/space/videos/liz-finale-1.mp4',
      '/casino/space/videos/liz-finale-2.mp4',
      '/casino/space/videos/shady-finale-1.mp4',
      '/casino/space/videos/shady-finale-2.mp4',
    ],
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

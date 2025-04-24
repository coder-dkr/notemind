export const THEMES = {
  light: {
    name: 'Light',
    value: 'light',
    primaryColor: 'hsl(0, 0%, 9%)',
    bgColor: 'hsl(0, 0%, 100%)',
  },
  dark: {
    name: 'Dark',
    value: 'dark',
    primaryColor: 'hsl(0, 0%, 98%)',
    bgColor: 'hsl(0, 0%, 3.9%)',
  },
  green: {
    name: 'Green',
    value: 'green',
    primaryColor: 'hsl(142, 69%, 58%)',
    bgColor: 'hsl(142, 72%, 29%)',
  },
  indigo: {
    name: 'Indigo Purple',
    value: 'indigo',
    primaryColor: 'hsl(262, 83%, 58%)',
    bgColor: 'hsl(262, 47%, 55%)',
  },
  sky: {
    name: 'Sky Blue',
    value: 'sky',
    primaryColor: 'hsl(198, 93%, 60%)',
    bgColor: 'hsl(198, 100%, 97%)',
  },
};

export type ThemeOption = keyof typeof THEMES;
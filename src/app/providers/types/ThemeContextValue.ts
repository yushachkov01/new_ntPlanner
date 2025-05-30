export type Theme = 'light' | 'dark';

export interface ThemeContextValue {
  theme: Theme;
  toggle(): void;
}

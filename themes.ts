import type { ThemeConfig, FontSettings } from './types';

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

const sansSerifFont = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';
const serifFont = 'Georgia, "Times New Roman", Times, serif';


export interface ThemeCategory {
  name: string;
  themes: ThemeConfig[];
}

export const themeCategories: ThemeCategory[] = [
    {
        name: "Light",
        themes: [
            {
                name: 'Paper',
                isPreset: true,
                colors: { bgPrimary: '#ffffff', bgSecondary: '#f7f7f8', bgTertiary: '#f0f0f1', accentPrimary: '#007AFF', accentSecondary: '#0056b3', textPrimary: '#080808', textSecondary: '#545458', textOnAccent: '#ffffff', border: '#e5e5e6' },
                typography: { fontFamily: sansSerifFont },
            },
            {
                name: 'Daylight',
                isPreset: true,
                colors: { bgPrimary: '#fbf8f2', bgSecondary: '#f5f1e9', bgTertiary: '#ede9df', accentPrimary: '#d95d1d', accentSecondary: '#b94e16', textPrimary: '#211f1a', textSecondary: '#655f53', textOnAccent: '#ffffff', border: '#dcd6ca' },
                typography: { fontFamily: sansSerifFont },
            },
            {
                name: 'Cloud Drift',
                isPreset: true,
                colors: { bgPrimary: '#F7F9FB', bgSecondary: '#EFF3F6', bgTertiary: '#E5E9ED', accentPrimary: '#A8C5E5', accentSecondary: '#87A6C4', textPrimary: '#2D3748', textSecondary: '#718096', textOnAccent: '#1A202C', border: '#DAE1E7' },
                typography: { fontFamily: sansSerifFont },
            },
            {
                name: 'Terracotta Calm',
                isPreset: true,
                colors: { bgPrimary: '#FDF6F0', bgSecondary: '#F9EFE5', bgTertiary: '#F2E6D8', accentPrimary: '#E27D60', accentSecondary: '#C96E54', textPrimary: '#5D5C61', textSecondary: '#8A898E', textOnAccent: '#FFFFFF', border: '#E4D8C9' },
                typography: { fontFamily: sansSerifFont },
            },
            {
                name: 'Ink & Ivory',
                isPreset: true,
                colors: { bgPrimary: '#FFFFF0', bgSecondary: '#F8F8EC', bgTertiary: '#F0F0E3', accentPrimary: '#D4AF37', accentSecondary: '#B89B31', textPrimary: '#0D1117', textSecondary: '#4A4A4A', textOnAccent: '#0D1117', border: '#E0E0D4' },
                typography: { fontFamily: serifFont },
            },
            {
                name: 'Tea Leaf',
                isPreset: true,
                colors: { bgPrimary: '#F0F4F0', bgSecondary: '#E6EBE6', bgTertiary: '#DDE2DD', accentPrimary: '#8A9A5B', accentSecondary: '#6B7848', textPrimary: '#4D4036', textSecondary: '#7A6C62', textOnAccent: '#FFFFFF', border: '#CFD4CF' },
                typography: { fontFamily: sansSerifFont },
            },
            {
                name: 'Dusty Rose',
                isPreset: true,
                colors: { bgPrimary: '#F6EAE9', bgSecondary: '#F0E0DE', bgTertiary: '#EAD7D4', accentPrimary: '#D8AFA7', accentSecondary: '#C09A92', textPrimary: '#705C58', textSecondary: '#9E8C88', textOnAccent: '#FFFFFF', border: '#DDCBC8' },
                typography: { fontFamily: sansSerifFont },
            },
            {
                name: 'Pebble Path',
                isPreset: true,
                colors: { bgPrimary: '#F5F5F5', bgSecondary: '#EAEAEA', bgTertiary: '#DDDDDD', accentPrimary: '#8A9B93', accentSecondary: '#6E7C75', textPrimary: '#595959', textSecondary: '#8C8C8C', textOnAccent: '#FFFFFF', border: '#CFCFCF' },
                typography: { fontFamily: sansSerifFont },
            },
        ]
    },
    {
        name: "Dark",
        themes: [
            {
                name: 'Midnight',
                isPreset: true,
                colors: { bgPrimary: '#121212', bgSecondary: '#1e1e1e', bgTertiary: '#2a2a2a', accentPrimary: '#0A84FF', accentSecondary: '#0060db', textPrimary: '#f0f0f0', textSecondary: '#a9a9a9', textOnAccent: '#ffffff', border: '#3a3a3c' },
                typography: { fontFamily: sansSerifFont },
            },
            {
                name: 'Slate',
                isPreset: true,
                colors: { bgPrimary: '#161b22', bgSecondary: '#212833', bgTertiary: '#2d3645', accentPrimary: '#58a6ff', accentSecondary: '#388bfd', textPrimary: '#e6edf3', textSecondary: '#909dab', textOnAccent: '#0d1117', border: '#30363d' },
                typography: { fontFamily: sansSerifFont },
            },
             {
                name: 'Forest',
                isPreset: true,
                colors: { bgPrimary: '#1a201f', bgSecondary: '#242b2a', bgTertiary: '#303837', accentPrimary: '#4a937e', accentSecondary: '#387a67', textPrimary: '#d8e0df', textSecondary: '#a0aba9', textOnAccent: '#ffffff', border: '#404a49' },
                typography: { fontFamily: sansSerifFont },
            },
            {
                name: 'Rainy Day',
                isPreset: true,
                colors: { bgPrimary: '#4A5568', bgSecondary: '#3A4556', bgTertiary: '#2D3748', accentPrimary: '#B4A6D4', accentSecondary: '#8E82AE', textPrimary: '#F7FAFC', textSecondary: '#CBD5E0', textOnAccent: '#1A202C', border: '#5A677B' },
                typography: { fontFamily: sansSerifFont },
            },
            {
                name: 'Moonlight Matte',
                isPreset: true,
                colors: { bgPrimary: '#262626', bgSecondary: '#333333', bgTertiary: '#404040', accentPrimary: '#99FFFF', accentSecondary: '#66CCCC', textPrimary: '#E0E0E0', textSecondary: '#B3B3B3', textOnAccent: '#1A1A1A', border: '#595959' },
                typography: { fontFamily: sansSerifFont },
            },
        ]
    },
    {
        name: "Sepia",
        themes: [
            {
                name: 'Sepia',
                isPreset: true,
                colors: { bgPrimary: '#f4e9db', bgSecondary: '#eadfce', bgTertiary: '#e1d6c5', accentPrimary: '#8a5a44', accentSecondary: '#6f4531', textPrimary: '#433426', textSecondary: '#7d6c5b', textOnAccent: '#ffffff', border: '#d3c7b6' },
                typography: { fontFamily: serifFont },
            },
             {
                name: 'Sepia Sketch',
                isPreset: true,
                colors: { bgPrimary: '#F3EADF', bgSecondary: '#E9DDCB', bgTertiary: '#E0D0B8', accentPrimary: '#704214', accentSecondary: '#583410', textPrimary: '#211E1A', textSecondary: '#5C5248', textOnAccent: '#FFFFFF', border: '#D1C0AA' },
                typography: { fontFamily: serifFont },
            },
            {
                name: 'Cocoa Whisper',
                isPreset: true,
                colors: { bgPrimary: '#F5EFE6', bgSecondary: '#EBE0D2', bgTertiary: '#E1D3C1', accentPrimary: '#7B3F00', accentSecondary: '#623200', textPrimary: '#4E3629', textSecondary: '#8B7D74', textOnAccent: '#FFFFFF', border: '#D4C6B4' },
                typography: { fontFamily: sansSerifFont },
            },
        ]
    },
     {
        name: "Accessibility",
        themes: [
            {
                name: 'Easy Read',
                isPreset: true,
                colors: { bgPrimary: '#f2eeda', bgSecondary: '#e9e1cd', bgTertiary: '#e0d8bf', accentPrimary: '#5c4b3a', accentSecondary: '#423528', textPrimary: '#3a2e21', textSecondary: '#5c4b3a', textOnAccent: '#ffffff', border: '#cec5b3' },
                typography: { fontFamily: serifFont },
                fontSettingsOverride: { size: 'lg', weight: 'normal' }
            },
            {
                name: 'Low Vision',
                isPreset: true,
                colors: { bgPrimary: '#000000', bgSecondary: '#1a1a1a', bgTertiary: '#2c2c2c', accentPrimary: '#ffff00', accentSecondary: '#e6e600', textPrimary: '#ffffff', textSecondary: '#f2f2f2', textOnAccent: '#000000', border: '#4d4d4d' },
                typography: { fontFamily: sansSerifFont },
                fontSettingsOverride: { size: 'lg', weight: 'bold' }
            },
            {
                name: 'Focus Mode',
                isPreset: true,
                colors: { bgPrimary: '#22272e', bgSecondary: '#2d333b', bgTertiary: '#39404a', accentPrimary: '#79c0ff', accentSecondary: '#58a6ff', textPrimary: '#cdd9e5', textSecondary: '#8592a0', textOnAccent: '#161b22', border: '#444c56' },
                typography: { fontFamily: sansSerifFont },
            },
             {
                name: 'Ocean',
                isPreset: true,
                colors: { bgPrimary: '#0f172a', bgSecondary: '#1e293b', bgTertiary: '#334155', accentPrimary: '#38bdf8', accentSecondary: '#0ea5e9', textPrimary: '#f1f5f9', textSecondary: '#94a3b8', textOnAccent: '#020617', border: '#334155' },
                typography: { fontFamily: sansSerifFont },
            },
        ]
    }
];

export const allThemes: ThemeConfig[] = themeCategories.flatMap(category => category.themes);

export const defaultTheme = allThemes.find(t => t.name === 'Easy Read') || allThemes[0];

// A mapping from FontSettings size to CSS font-size value
const fontSizes: Record<FontSettings['size'], string> = {
    sm: '14px',
    base: '16px',
    lg: '18px',
};

// A mapping from FontSettings weight to CSS font-weight values
const fontWeights: Record<FontSettings['weight'], { normal: string, bold: string }> = {
    normal: { normal: '400', bold: '700' },
    bold: { normal: '500', bold: '800' },
};

export const applyTheme = (theme: ThemeConfig, fontSettings: FontSettings, element: HTMLElement | null = null) => {
    const root = element || document.documentElement;

    // --- Apply Colors ---
    root.style.setProperty('--color-bg-primary', theme.colors.bgPrimary);
    root.style.setProperty('--color-bg-secondary', theme.colors.bgSecondary);
    root.style.setProperty('--color-bg-tertiary', theme.colors.bgTertiary);
    root.style.setProperty('--color-accent-primary', theme.colors.accentPrimary);
    root.style.setProperty('--color-accent-secondary', theme.colors.accentSecondary);
    root.style.setProperty('--color-text-primary', theme.colors.textPrimary);
    root.style.setProperty('--color-text-secondary', theme.colors.textSecondary);
    root.style.setProperty('--color-text-on-accent', theme.colors.textOnAccent);
    root.style.setProperty('--color-border', theme.colors.border);
    
    // --- Apply Typography ---
    root.style.setProperty('--font-family', theme.typography.fontFamily);
    document.body.style.fontFamily = theme.typography.fontFamily;

    // Apply font size and weight from user settings
    root.style.setProperty('--font-size-base', fontSizes[fontSettings.size]);
    const weights = fontWeights[fontSettings.weight];
    root.style.setProperty('--font-weight-normal', weights.normal);
    root.style.setProperty('--font-weight-bold', weights.bold);

    // --- Generate and Apply Derivative Colors for TailwindCSS compatibility ---
    const bgSecondaryRgb = hexToRgb(theme.colors.bgSecondary);
    const bgSecondaryAlpha = bgSecondaryRgb ? `rgba(${bgSecondaryRgb.r}, ${bgSecondaryRgb.g}, ${bgSecondaryRgb.b}, 0.8)` : theme.colors.bgSecondary;
    
    const textSecondaryRgb = hexToRgb(theme.colors.textSecondary);
    const textPlaceholder = textSecondaryRgb ? `rgba(${textSecondaryRgb.r}, ${textSecondaryRgb.g}, ${textSecondaryRgb.b}, 0.5)` : theme.colors.textSecondary;
    const textTertiary = textSecondaryRgb ? `rgba(${textSecondaryRgb.r}, ${textSecondaryRgb.g}, ${textSecondaryRgb.b}, 0.7)` : theme.colors.textSecondary;

    root.style.setProperty('--color-bg-secondary-alpha', bgSecondaryAlpha);
    root.style.setProperty('--color-bg-interactive', theme.colors.bgTertiary);
    root.style.setProperty('--color-border-primary', theme.colors.border);
    root.style.setProperty('--color-border-secondary', theme.colors.border);
    root.style.setProperty('--color-text-tertiary', textTertiary);
    root.style.setProperty('--color-text-placeholder', textPlaceholder);
    root.style.setProperty('--color-accent-hover', theme.colors.accentSecondary);
    root.style.setProperty('--color-accent-focus', theme.colors.accentPrimary);
    // Disable aggressive gradients by default, but keep vars for compatibility
    root.style.setProperty('--color-accent-gradient-from', theme.colors.accentPrimary);
    root.style.setProperty('--color-accent-gradient-to', theme.colors.accentSecondary);

    // Disable glassmorphism for readability
    root.style.setProperty('--glass-blur', '20px');
};
